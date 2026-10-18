$(document).ready(function() {

    // buka-tutup menu navigasi (ikon garis tiga) buat versi HP
    $('#menu-icon').click(function() {
        $(this).toggleClass('bx-x');
        $('.navbar').slideToggle(300);
    });

    // Menyesuaikan tampilan navbar saat ukuran layar diubah (mencegah bug menu hilang di desktop)
    $(window).resize(function() {
        if ($(window).width() >= 992) {
            $('.navbar').show();
            $('#menu-icon').removeClass('bx-x');
        } else {
            if (!$('#menu-icon').hasClass('bx-x')) {
                $('.navbar').hide();
            }
        }
    });

    // fungsi tombol like: nambah/ngurangin angka sama ganti icon love
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

    // helper: smooth scroll ke section/anchor manapun dengan offset header
    function scrollToHash(hash) {
        let $target = $(hash);
        if ($target.length) {
            $('html, body').animate({
                scrollTop: $target.offset().top - 80
            }, 500);
        }
    }

    $('.navbar a').click(function(e) {
        if (this.hash !== "") {
            e.preventDefault();
            scrollToHash(this.hash);

            $('.navbar a').removeClass('active');
            $(this).addClass('active');

            if ($(window).width() < 992) {
                $('#menu-icon').removeClass('bx-x');
                $('.navbar').slideUp();
            }
        }
    });

    // link menu di footer -> scroll ke kartu menu yang sesuai
    $('.footer-menu-link').click(function(e) {
        if (this.hash !== "") {
            e.preventDefault();
            scrollToHash(this.hash);
        }
    });

    //accordion
    $('.faq-question').click(function() {

        let $answer = $(this).next('.faq-answer');
        let $parentItem = $(this).parent('.faq-item');

        $('.faq-answer').not($answer).slideUp(300);
        $('.faq-item').not($parentItem).removeClass('active');

        $answer.slideToggle(300);
        $parentItem.toggleClass('active');
    });

    //contact form
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        $('#successPopup').addClass('show');
        $(this)[0].reset();
    });

    //close popup
    $('#closePopup').click(function() {
        $('#successPopup').removeClass('show');
    });

    //close popup saat klik di luar
    $('#successPopup').click(function(e) {
        if (e.target === this) {
            $('#successPopup').removeClass('show');
        }
    });

});
