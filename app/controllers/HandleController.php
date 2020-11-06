<?php

namespace app\controllers;

use app\models\CartManager;
use app\models\ProductManager;
use Exception;

/**
 * Controller HandleController
 *
 * @package app\controllers
 */
class HandleController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    protected array $data = [];
    protected array $head = [];

    /**
     * Handles ajax requests
     *
     * @param array      $params
     * @param array|null $gets
     *
     * @return void
     * @throws Exception
     */
    public function process(array $params, array $gets = null)
    {
        if (isset($params[0])) {
            switch ($params[0]) {
                default:
                    break;
            }
        } else {
            http_response_code(404);
        }
    }

    /**
     * @return void
     */
    public function writeView(): void
    {
        $return = array_merge($this->head, $this->data);
        echo(json_encode($return));
    }


}
