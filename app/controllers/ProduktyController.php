<?php

namespace app\controllers;

/**
 * Controller ProduktyController
 *
 * @package app\controllers
 */
class ProduktyController extends Controller
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
            $function = ucfirst(strtolower($params[0]));
            array_shift($params);
            if (is_file("../app/views/Produkty/" . $function . ".latte")) {
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

    private function renderKategorie()
    {
        $this->head['page_title'] = "pro helenku";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('kategorie');
    }

    private function renderCeny()
    {
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('ceny');
    }

    private function renderSklad()
    {
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('sklad');
    }

    private function renderSlevy()
    {
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('slevy');
    }

    private function renderImport()
    {
        $this->head['page_title'] = "";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('import');
    }
}
