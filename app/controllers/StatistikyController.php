<?php

namespace app\controllers;

/**
 * Controller StatistikyController
 *
 * @package app\controllers
 */
class StatistikyController extends Controller
{
    public function __construct()
    {
        parent::__construct();
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
            $function = str_replace(" ", "", ucwords(str_replace("-", " ",strtolower($params[0]))));
            array_shift($params);
            if (is_file("../app/views/Statistiky/" . $function . ".latte")) {
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
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('default');
    }

    private function renderNavstevnost()
    {
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('navstevnost');
    }

    private function renderProdej()
    {
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('prodej');
    }

    private function renderSkladovePohyby()
    {
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('skladovepohyby');
    }

    private function renderSlevy()
    {
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('slevy');
    }
}
