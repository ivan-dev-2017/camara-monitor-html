<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class MonitorWsController extends AbstractController
{
    /**
     * @Route("/monitor/ws", name="monitor_ws")
     */
    public function index()
    {
        return $this->render('monitor_ws/index.html.twig', [
            'controller_name' => 'MonitorWsController',
        ]);
    }
}
