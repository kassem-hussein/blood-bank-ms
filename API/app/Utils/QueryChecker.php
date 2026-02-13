<?php

namespace App\Utils;

use Ramsey\Uuid\Type\Integer;

class QueryChecker{


    public function isValidDate($date , $format = 'Y-m-d'){
        $d = \DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }

    public function isValidInteger($input){
        return filter_var($input,FILTER_VALIDATE_INT) !== FALSE;
    }


}
