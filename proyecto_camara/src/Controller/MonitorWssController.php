<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class MonitorWssController extends AbstractController
{
    /**
     * @Route("/monitor/wss", name="monitor_wss")
     */
    public function index()
    {
        return $this->render('monitor_wss/index.html.twig', [
            'controller_name' => 'MonitorWssController',
        ]);
    }
}
