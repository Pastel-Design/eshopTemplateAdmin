<?php


namespace app\controllers;


use app\forms\FullSignUp;
use app\forms\FullSignIn;
use app\models\SignManager;
use app\router\Router;
use Exception;

/**
 * Controller SignController
 *
 * @package app\controllers
 */
class SignController extends Controller
{

    /**
     * @var FullSignIn $signInFactory
     */
    private FullSignIn $signInFactory;

    public function __construct()
    {
        parent::__construct();
        $this->signInFactory = new FullSignIn();
    }

    /**
     * @param array      $params
     * @param array|null $gets
     *
     * @return void
     * @throws Exception
     */
    public function process(array $params, array $gets = null)
    {
        switch ($params[0]) {
            case "in":
                $this->signIn();
                break;
            case "out":
                $this->signOut();
                break;
            default:
                Router::reroute("error/404");
                break;
        }
    }


    /**
     * Renders signin view with signin form
     *
     * @return void
     */
    public function signIn()
    {
        $this->head['page_title'] = "Přihlášení nového uživatele";
        $this->head['page_keywords'] = "Přihlášení;přihlášení;eshop;";
        $this->head['page_description'] = "Přihlášení na eshop";
        $this->setView('home');
        $this->data["form"] = $this->signInFactory->create(function () {
            $this->addFlashMessage("Přihlášení proběhlo úspěšně");
            Router::reroute("home");
        });
        $this->setView("In");
    }

    /**
     * Signs out a user
     *
     * @return void
     */
    public function signOut()
    {
        SignManager::SignOut();
        Router::reroute("home");
    }
}
