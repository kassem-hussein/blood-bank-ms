<?php

namespace Tests\Unit;

use App\Utils\QueryChecker;
use PHPUnit\Framework\TestCase;

class QueryCheckerTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_is_valid_date(): void
    {
        //call
       $cheker =new QueryChecker();
       // action
       $result = $cheker->isValidDate('2025-02-18');
       // assertion
        $this->assertEquals($result,true);

    }

    public function test_is_not_valid_date():void{
         //call
       $cheker =new QueryChecker();
       // action
       $result = $cheker->isValidDate('testing item');
       // assertion
        $this->assertEquals($result,false);
    }

    public function test_is_vaild_integer():void{
        $checker = new QueryChecker();
        $result = $checker->isValidInteger('55');
        $this->assertEquals($result,true);
    }
    public function test_float_is_not_valid_integer():void{
        $checker = new QueryChecker();
        $result = $checker->isValidInteger('55.5');
        $this->assertEquals($result,false);
    }
    public function test_str_is_not_valid_integer():void{
        $checker = new QueryChecker();
        $result = $checker->isValidInteger('items');
        $this->assertEquals($result,false);
    }

    public function test_date_is_not_valid_integer():void{
        $checker = new QueryChecker();
        $result = $checker->isValidInteger('18-02-2025');
        $this->assertEquals($result,false);
    }

}
