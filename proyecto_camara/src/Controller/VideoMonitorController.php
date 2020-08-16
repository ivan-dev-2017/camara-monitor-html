<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class VideoMonitorController extends AbstractController
{
    /**
     * @Route("/video/monitor", name="video_monitor")
     */
    public function index()
    {
        return $this->render('video_monitor/index.html.twig', [
            'controller_name' => 'VideoMonitorController',
        ]);
    }
}
