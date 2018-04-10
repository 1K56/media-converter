<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function upload(Request $req) {
        $this->validate($req, [
            'media' => 'required|mimetypes:video/webm'
        ]);

        $path = $req->file('media')->store('public/media');

        return response()->json([
            'status' => 'success',
            'path' => $path
        ]);
    }
}
