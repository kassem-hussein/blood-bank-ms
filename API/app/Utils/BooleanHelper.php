<?php

namespace App\Utils;

class BooleanHelper{

    public function anyOf(...$items){
        foreach($items as $item){
            if($item == true){
                return true;
            }
        }
        return false;
    }
    public function allOf(bool $check,...$items){
        foreach($items as $item){
            if($item != $check){
                return false;
            }
        }
        return true;
    }

}
