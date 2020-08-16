<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CamaraWsController extends AbstractController
{
    /**
     * @Route("/camara/ws", name="camara_ws")
     */
    public function index()
    {
        return $this->render('camara_ws/index.html.twig', [
            'controller_name' => 'CamaraWsController',
        ]);
    }
}
