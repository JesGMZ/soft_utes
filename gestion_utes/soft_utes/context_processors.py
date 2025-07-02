def base_template_selector(request):
    if request.user.is_authenticated:
        return {
            'base_template': 'base.html' if request.user.is_superuser else 'base_usuario.html'
        }
    return {
        'base_template': 'base_usuario.html'
    }
