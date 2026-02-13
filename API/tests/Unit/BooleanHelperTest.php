<?php

namespace Tests\Unit;

use App\Utils\BooleanHelper;
use PHPUnit\Framework\TestCase;

class BooleanHelperTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_all_of_result_false(): void
    {
      $booleanHelper = new  BooleanHelper();
      $res = $booleanHelper->allOf(false,false,false,false,true);
      $this->assertEquals($res,false);
    }
    public function test_all_of_result_true(): void
    {
      $booleanHelper = new  BooleanHelper();
      $res = $booleanHelper->allOf(false,false,false,false,false);
      $this->assertEquals($res,true);
    }
}
