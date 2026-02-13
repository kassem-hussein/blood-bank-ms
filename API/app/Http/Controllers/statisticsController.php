<?php

namespace App\Http\Controllers;

use App\Models\Donor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use PDOException;

class statisticsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        try {

            // 1. BLOOD STATISTICS (status + bloodType)
            $rawData = DB::table('blood_units')
                ->selectRaw('status, bloodType AS type, SUM(CAST(volume AS SIGNED)) AS volume, COUNT(bloodType) AS units')
                ->groupBy('bloodType', 'status')
                ->get();

            $bloodStatistics = [];
            $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
            $statuses = ['testing', 'used', 'available', 'invalid', 'expired'];

            foreach ($bloodTypes as $type) {
                foreach ($statuses as $status) {
                    $bloodStatistics[$type][$status] = ['volume' => 0, 'units' => 0];
                }
            }

            foreach ($rawData as $item) {
                $bloodStatistics[$item->type][$item->status] = [
                    'volume' => $item->volume,
                    'units'  => $item->units,
                ];
            }


            // 2. MONTHLY DONATIONS (donor_id NOT NULL)
            $rawData = DB::table('blood_units')
                ->selectRaw('MONTH(donationDate) AS month, COUNT(bloodType) AS units')
                ->whereNotNull('donor_id')
                ->whereRaw('YEAR(donationDate) = ?', [Carbon::now()->year])
                ->groupBy('month')
                ->get()
                ->keyBy('month');

            $donationStatistics = [];
            collect(range(1, 12))->each(function ($month) use ($rawData, &$donationStatistics) {
                $donationStatistics[(string)$month] = $rawData->has($month) ? $rawData[$month]->units : 0;
            });


            // 3. MONTHLY IMPORTS (donor_id NULL)
            $import_statistics_raw = DB::table('blood_units')
                ->join('imports', 'blood_units.import_id', '=', 'imports.id')
                ->selectRaw('MONTH(importDate) AS month, COUNT(bloodType) AS units')
                ->whereNull('donor_id')
                ->whereRaw('YEAR(importDate) = ?', [Carbon::now()->year])
                ->groupBy('month')
                ->get()
                ->keyBy('month');

            $monthly_import_statistics = [];
            collect(range(1, 12))->each(function ($month) use ($import_statistics_raw, &$monthly_import_statistics) {
                $monthly_import_statistics[(string)$month] = $import_statistics_raw->has($month)
                    ? $import_statistics_raw[$month]->units
                    : 0;
            });


            // 4. MONTHLY EXPORTS
            $monthly_export_raw = DB::table('exports')
                ->join('blood_units', 'exports.id', '=', 'blood_units.export_id')
                ->selectRaw('MONTH(exportDate) AS month, COUNT(bloodType) AS units')
                ->whereRaw('YEAR(exportDate) = ?', [Carbon::now()->year])
                ->groupBy('month')
                ->get()
                ->keyBy('month');

            $monthly_export_statistics = [];
            collect(range(1, 12))->each(function ($month) use ($monthly_export_raw, &$monthly_export_statistics) {
                $monthly_export_statistics[(string)$month] = $monthly_export_raw->has($month)
                    ? $monthly_export_raw[$month]->units
                    : 0;
            });


            // 5. TOP 10 DONORS
            $top_10_donors = Donor::orderBy('donations', 'desc')->limit(10)->get();


            // 6. RETURN RESPONSE
            return response()->json([
                'success' => true,
                'blood_statistics'              => $bloodStatistics,
                'monthly_donations_statistics'  => $donationStatistics,
                'monthly_import_statistics'     => $monthly_import_statistics,
                'monthly_export_statistics'     => $monthly_export_statistics,
                'top_10_donors'                 => $top_10_donors
            ]);
        } catch (PDOException $ex) {
            return response()->json([
                'success' => false,
                'message' => 'فشلت عملية جلب البيانات الرجاء المحاولة لاحقاً',
                'excption' => $ex
            ]);
        }
    }

    public function checkUnit()
    {
        try {

            $unit = request()->query('unit');
            $units = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

            if (!$unit and !in_array($unit, $units)) {
                return response()->json([
                    'success' => false,
                    'message' => 'الرجاء الاستعلام عن وحدة دموية من الاتي : A+,A-,B+,B-,AB+,AB-,O+,O-'
                ]);
            }

            $unit_raw = DB::table('blood_units')
                ->selectRaw('COUNT(bloodType) AS units, COALESCE(SUM(CAST(volume AS SIGNED)), 0) AS volume')
                ->where("bloodType", $unit)
                ->where('status', 'available')
                ->first();



            return response()->json([
                'success' => true,
                'units' => $unit_raw->units,
                'volume' => $unit_raw->volume
            ]);
        } catch (PDOException $ex) {
            return response()->json([
                'success' => false,
                'message' => 'فشلت عملية جلب البيانات الرجاء المحاولة لاحقاً',
            ]);
        }
    }
}
