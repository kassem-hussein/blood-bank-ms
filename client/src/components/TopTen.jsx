import React from 'react'
const TopTen = ({topTen}) => {

  return (
    
      <div className="overflow-x-auto px-4 py-2 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 py-2">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">#</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الاسم</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">البريد الإلكتروني</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">الزمرة الدموية</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">حالات التبرع</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">تاريخ اخر تبرع</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">روابط</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* {topTen.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.email}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.bloodType}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.donations || 0}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      item.last_donation
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >{item.last_donation || 'N/A'}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <a href={`https://wa.me/+963${item.phone}`}>
                        <i className="fa-brands fa-whatsapp " style={{fontSize:'36px',color:'#25D366'}}></i>
                  </a> 
                  
                </td>
              </tr>
            ))} */}
            {topTen.map((item,key) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">{item.email}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">{item.bloodType}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">{item.donations || 0}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      item.lastDonation
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >{item.lastDonation || 'N/A'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <a href={`https://wa.me/+963${item.phone}`}>
                        <i className="fa-brands fa-whatsapp " style={{fontSize:'36px',color:'#25D366'}}></i>
                  </a> 
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}

export default TopTen



{/* <div class="overflow-x-auto bg-gray-50 px-4 py-8">
  <table class="min-w-full divide-y divide-gray-200">
    <!-- Table Head -->
    <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">discount</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon Code</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empty</th>
      </tr>
    </thead>

    <!-- Table Body -->
    <tbody class="bg-white divide-y divide-gray-200">
    @foreach ($orders as $order)
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{$order->id}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{$order->subtotal}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{$order->shipping}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{$order->tax}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{$order->discount}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{$order->total}}</td>

            <td class="px-6 py-4 whitespace-nowrap">
            @php
                $statusClasses = [
                    'pending'    => 'bg-yellow-100 text-yellow-800',
                    'paid'       => 'bg-green-100 text-green-800',
                    'shipped'    => 'bg-orange-100 text-orange-800',
                    'completed'  => 'bg-blue-100 text-blue-800',
                    'cancelled'  => 'bg-red-100 text-red-800',
                ];
            @endphp

            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {{ $statusClasses[$order->status] ?? 'bg-gray-100 text-gray-800' }}">
                {{ ucfirst($order->status) }}
            </span>
        </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{$order->coupon_code}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{$order->created_at}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-3">
                    <!-- View Button -->
                    <a href="{{ route('order-item', ['id' => $order['id']]) }}">
                        <button type="button"
                                class="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md shadow
                                    hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                            View
                        </button>

                    </a>

                    <!-- Cancel Button (only if pending) -->
                    @if ($order->status == 'pending')
                        <form method="POST" action="{{ route('cancel-order', ['id' => $order['id']]) }}">
                            @csrf
                            <button type="submit"
                                    class="px-4 py-2 border border-orange-600 text-orange-600 text-sm font-medium rounded-md
                                        hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                Cancle
                            </button>

                        </form>
                    @endif
                </div>
            </td>
        </tr>

    @endforeach
    </tbody>
  </table>
</div> */}

// export default function ResponsiveTable({ rows }) {
//   // rows = [{ id, name, role, status, updatedAt }, ...]
//   return (
//     <div className="bg-white shadow rounded-lg">
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-left">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-xs font-medium text-gray-600">ID</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-600">Name</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-600">Role</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th>
//               <th className="px-4 py-3 text-xs font-medium text-gray-600">Updated</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r) => (
//               <tr key={r.id} className="border-t">
//                 <td className="px-4 py-3 text-sm text-gray-900">{r.id}</td>
//                 <td className="px-4 py-3 text-sm text-gray-900">{r.name}</td>
//                 <td className="px-4 py-3 text-sm text-gray-700">{r.role}</td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
//                       r.status === 'Active'
//                         ? 'bg-emerald-100 text-emerald-700'
//                         : r.status === 'Pending'
//                         ? 'bg-amber-100 text-amber-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}
//                   >
//                     {r.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-500">{r.updatedAt}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



//  <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
//   <table class="">
//     <thead>
//       <tr>
//         <th class="p-4 border-b border-slate-300 bg-slate-50">
//           <p class="block text-sm font-normal leading-none text-slate-500">
//             Name
//           </p>
//         </th>
//         <th class="p-4 border-b border-slate-300 bg-slate-50">
//           <p class="block text-sm font-normal leading-none text-slate-500">
//             Job
//           </p>
//         </th>
//         <th class="p-4 border-b border-slate-300 bg-slate-50">
//           <p class="block text-sm font-normal leading-none text-slate-500">
//             Employed
//           </p>
//         </th>
//         <th class="p-4 border-b border-slate-300 bg-slate-50">
//           <p class="block text-sm font-normal leading-none text-slate-500"></p>
//         </th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr class="hover:bg-slate-50">
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             John Michael
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             Manager
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             23/04/18
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <a href="#" class="block text-sm font-semibold text-slate-800">
//             Edit
//           </a>
//         </td>
//       </tr>
//       <tr class="hover:bg-slate-50">
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             Alexa Liras
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             Developer
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             23/04/18
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <a href="#" class="block text-sm font-semibold text-slate-800">
//             Edit
//           </a>
//         </td>
//       </tr>
//       <tr class="hover:bg-slate-50">
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             Laurent Perrier
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             Executive
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             19/09/17
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <a href="#" class="block text-sm font-semibold text-slate-800">
//             Edit
//           </a>
//         </td>
//       </tr>
//       <tr class="hover:bg-slate-50">
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             Michael Levi
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             Developer
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <p class="block text-sm text-slate-800">
//             24/12/08
//           </p>
//         </td>
//         <td class="p-4 border-b border-slate-200">
//           <a href="#" class="block text-sm font-semibold text-slate-800">
//             Edit
//           </a>
//         </td>
//       </tr>
//       <tr class="hover:bg-slate-50">
//         <td class="p-4">
//           <p class="block text-sm text-slate-800">
//             Richard Gran
//           </p>
//         </td>
//         <td class="p-4">
//           <p class="block text-sm text-slate-800">
//             Manager
//           </p>
//         </td>
//         <td class="p-4">
//           <p class="block text-sm text-slate-800">
//             04/10/21
//           </p>
//         </td>
//         <td class="p-4">
//           <a href="#" class="block text-sm font-semibold text-slate-800">
//             Edit
//           </a>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>
 


