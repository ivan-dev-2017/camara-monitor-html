<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class WebsocketVideoController extends AbstractController
{
    /**
     * @Route("/websocket/video", name="websocket_video")
     */
    public function index()
    {
        return $this->render('websocket_video/index.html.twig', [
            'controller_name' => 'WebsocketVideoController',
        ]);
    }
}
