<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CamaraWssController extends AbstractController
{
    /**
     * @Route("/camara/wss", name="camara_wss")
     */
    public function index()
    {
        return $this->render('camara_wss/index.html.twig', [
            'controller_name' => 'CamaraWssController',
        ]);
    }
}
