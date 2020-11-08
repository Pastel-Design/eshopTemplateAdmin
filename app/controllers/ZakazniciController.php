<?php

namespace app\controllers;

use app\models\UserManager;

/**
 * Controller ZakazniciController
 *
 * @package app\controllers
 */
class ZakazniciController extends Controller
{
    private UserManager $userManager;
    public function __construct()
    {
        parent::__construct();
        $this->userManager = new UserManager();
    }

    /**
     * Sets default homepage
     *
     * @param array      $params
     * @param array|null $gets
     *
     * @return void
     */
    public function process(array $params, array $gets = null)
    {
        if (isset($params[0])) {
            $function = str_replace("-","",ucfirst(strtolower($params[0])));
            array_shift($params);
            if (is_file("../app/views/Zakaznici/" . $function . ".latte")) {
                call_user_func(array($this, "render" . $function), $params);
            } else {
                $this->renderSouhrn();
            }
        } else {
            $this->renderSouhrn();
        }
    }
    private function renderSouhrn()
    {
        $users = $this->userManager->selectUsers();
        $this->data=["users"=>$users];
        $this->head['page_title'] = "Zákazníci";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('default');
    }
}
