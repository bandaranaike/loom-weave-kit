# Laravel + Inertia Wiring

Use this to wire `examples/LoomWeaveInertiaPage.tsx` into your Laravel app.

## 1) Install packages in your Laravel app

```bash
pnpm add @erbitron/loom-weave-kit @erbitron/loom-weave-kit-react @erbitron/loom-weave-kit-export-canvas
```

## 2) Add the Inertia page file

Copy:

- `examples/LoomWeaveInertiaPage.tsx` -> `resources/js/Pages/LoomWeaveDemo.tsx`

## 3) Add route and controller

`routes/web.php`

```php
use App\Http\Controllers\LoomWeaveDemoController;

Route::get('/loom-weave-demo', LoomWeaveDemoController::class)
    ->middleware(['auth', 'verified'])
    ->name('loom-weave-demo');
```

`app/Http/Controllers/LoomWeaveDemoController.php`

```php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LoomWeaveDemoController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('LoomWeaveDemo');
    }
}
```

## 4) Run your app

```bash
php artisan serve
pnpm dev
```

Open `/loom-weave-demo`.
