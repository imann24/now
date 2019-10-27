class SlugManager {
    currentSlug() {
        return document.location.pathname.replace('/', '');
    };
    changeSlug(slug) {
        if (this.currentSlug() === slug) {
            return;
        }
        window.history.pushState('chat', 'My Chat', `/${slug}`);
    };
}

export default SlugManager;
