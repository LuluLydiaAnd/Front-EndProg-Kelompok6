$(document).ready(function() {

    // tutup navbar mobile setelah link diklik
    const navCollapseEl = document.getElementById('navMenu');

    $('.navbar-nav .nav-link').click(function() {
        if ($(window).width() < 992 && navCollapseEl) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapseEl)
                || new bootstrap.Collapse(navCollapseEl, { toggle: false });
            bsCollapse.hide();
        }
    });

    // tandai link aktif mengikuti posisi scroll
    $(window).scroll(function() {
        const scrollPos = $(window).scrollTop() + 120;

        $('section[id]').each(function() {
            const top = $(this).offset().top;
            const bottom = top + $(this).outerHeight();
            const id = $(this).attr('id');

            if (scrollPos >= top && scrollPos < bottom) {
                $('.navbar-nav .nav-link').removeClass('active');
                $('.navbar-nav .nav-link[href="#' + id + '"]').addClass('active');
            }
        });
    });

    // fungsi tombol like: menambah/mengurang angka dan mengganti icon love
    $('.btn-like').click(function(e) {
        e.preventDefault();

        let $btn = $(this);
        let $countSpan = $btn.find('.like-count');
        let currentCount = parseInt($countSpan.text());

        if ($btn.hasClass('liked')) {
            // membatalkan like (angka -1)
            $btn.removeClass('liked');
            $countSpan.text(currentCount - 1);
            $btn.find('i').removeClass('bxs-heart').addClass('bx-heart');
        } else {
            // menambahkan like (angka +1)
            $btn.addClass('liked');
            $countSpan.text(currentCount + 1);
            $btn.find('i').removeClass('bx-heart').addClass('bxs-heart');

            // animasi kedip saat klik like
            $btn.find('i').fadeOut(100).fadeIn(100);
        }
    });

});

$('#contactForm').on('submit', function(e) {
    e.preventDefault();

    $('#successPopup').addClass('show');

    this.reset();
});

$('#contactForm'),on('submit', function(e) {
    e.preventDefault();
    $('#successPopup').addClass('show');
    this.reset();
});

$('#closePopup').on('click', function(){
    $('#successPopup').removeClass('show');
});
