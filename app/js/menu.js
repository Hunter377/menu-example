$(document).ready(function () {
	var $megaMenu = $('.mega-menu');
	var $topMenu = $('.mega-menu .top-menu');
	var $underbar = $('.mega-menu .underbar');
	var $menu = $('.mega-menu .menu');
	var $megaMenuHeight = $megaMenu.outerHeight();
	var menuAnimationTimeout = 0;
	var lastScrollTop = 0;
    var scrollPast = false;
    var isDesktop = false;

	// Mobile
	var $naviconCheckbox = $('#navicon-check');

    function MenuBuild() {
        // Desktop Functionality
        if ($(window).width() >= 768) {
            // Underbar Functionality
            $('.mega-menu .bottom-link').on('click touch', function () {
                if (menuAnimationTimeout == 0) {
                    menuAnimationTimeout++;
                    var $thisWidth = $(this).width();
                    var $thisPosition = $(this).position().left;
                    var $menuPosition = $('.mega-menu .bottom-link').index($(this));
                    var $menuSelected = $('.mega-menu .menu .menu-content').eq($menuPosition);
                    var $menuHeight = $menuSelected.outerHeight();
                    var menuTransition = 100;

                    $underbar.width($thisWidth);
                    $underbar.css('left', $thisPosition);

                    if (!$menu.hasClass('open')) {
                        $menu.addClass('open');
                    } else {
                        menuTransition = 400;
                    }

                    $('.mega-menu .menu .menu-content.active').removeClass('active');

                    $menu.css('height', $menuHeight + 'px');
                    setTimeout(function () {
                        $menuSelected.addClass('active');
                        menuAnimationTimeout = 0;
                    }, menuTransition);
                }
            });

            // Prepend AVA Compliance Skip Link
            $megaMenu.prepend('<a href="#" class="opacity-0 absolute">Skip Header</a>');
            $('.mega-menu > a.absolute').on('keydown', function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    $megaMenu.find('*').attr('tabindex', -1);
                }
            });

            // Offclick Menu
            $(document).on('click touch', function () {
                $underbar.width(0);
                $underbar.css('left', 0);
                $('.mega-menu .menu .menu-content.active').removeClass('active');
                $menu.removeClass('open');
            });
            $('.mega-menu').click(function (e) {
                e.stopPropagation();
            });

            // Scroll Check
            $(window).scroll(function (event) {
                var st = $(this).scrollTop();
                var $bottomMenu = $('.mega-menu .menu-primary');

                // Scroll Up and Down
                if (st > $megaMenuHeight + 100 && scrollPast === true) {
                    if (!$menu.hasClass('open')) {
                        if (st > lastScrollTop) {
                            // Downscroll
                            if (st - lastScrollTop > 3) {
                                $bottomMenu.css('top', 14 + 'px');
                            }
                        } else {
                            // Upscroll
                            if (lastScrollTop - st > 3) {
                                $bottomMenu.css('top', 75 + 'px');
                            }
                        }
                    }
                }

                if (st > $megaMenuHeight + 100 && scrollPast === false) {
                    $megaMenu.css('top', -136 + 'px');
                    $menu.css('top', 136 + 'px');
                    if ($menu.hasClass('open')) {
                        $bottomMenu.css('top', 75 + 'px');
                    }
                    // Make Menu Sticky
                    setTimeout(function () {
                        $('body').css('padding-top', $megaMenuHeight);
                        $megaMenu.addClass('fixed');
                        $topMenu.addClass('absolute');
                        $megaMenu.css('top', 0 + 'px');
                        if (!$menu.hasClass('open')) {
                            $bottomMenu.css('top', 14 + 'px');
                        }
                    }, 200);
                    scrollPast = true;
                }
                if (st < $megaMenuHeight + 100 && scrollPast === true) {
                    $megaMenu.css('top', -136 + 'px');
                    $menu.css('top', 100 + '%');
                    $bottomMenu.css('top', 0);
                    // Remove Sticky Header
                    setTimeout(function () {
                        $('body').css('padding-top', 0);
                        $megaMenu.removeClass('fixed').css('top', 0 + 'px');
                        $topMenu.removeClass('absolute');
                    }, 150);
                    scrollPast = false;
                }
                lastScrollTop = st;
            });

            $('.mega-menu .bottom-link').on('keydown', function (e) {
                var key = e.which;
                var enterKey = 13;
                var escapeKey = 27;
                var $this = $(this);

                // Reset the tab index for the bottom links
                if (!$('.mega-menu .menu').hasClass('open')) {
                    $('.mega-menu .bottom-link').attr('tabindex', 0);
                }

                if (key == enterKey) {
                    $this.nextAll().attr('tabindex', -1);
                    $this.click();
                    setTimeout(function () {
                        $('.mega-menu .menu').focusin();
                    }, 1000);
                    return false;
                } else if (key == escapeKey) {
                    // Unfocus the open mega menu
                    $('body').click();
                }
            });
            isDesktop = true;
        } else {
            var innerMenu = $('.menu-secondary > li > p + ul');
            // Open Menu
            $('.mega-menu .mobile-hamburger').on('click touch', function () {
                if ($naviconCheckbox.is(':checked')) {
                    $megaMenu.addClass('mobile-open');
                } else {
                    $megaMenu.removeClass('mobile-open slide-open inner-slide-open');
                    setTimeout(function () {
                        $('.mega-menu div').removeClass('z-1');
                    }, 600);
                }
            });

            // Menu Link Clicked
            $('.mega-menu div.bottom-link').on('click touch', function () {
                $megaMenu.addClass('slide-open');
                var clickedElement = $(this).index();
                $('.menu .menu-content:nth-child(' + (clickedElement + 1) + ')').addClass('z-1');
            });
            // Back Hero Clicked
            $('.mega-menu .menu .h1-sm').on('click touch', function () {
                $megaMenu.removeClass('slide-open');
                setTimeout(function () {
                    $('.menu .menu-content').removeClass('z-1');
                }, 350);
            });

            // Inner Menu Link Clicked
            $('.menu-secondary > li > p').on('click touch', function () {
                var backName = $(this).text();
                $(this).siblings('.inner-menu').find('.h1-sm').text(backName);
                $megaMenu.addClass('inner-slide-open');
            });

            // Inner Menu Setup Back Button
            if (!innerMenu.hasClass('inner-menu')) {
                innerMenu.addClass('inner-menu');
                innerMenu.prepend(
                    '<li style="border-bottom:0px;" class="p-a-0 hidden block-sm"><div class="menu-title"><h1 class="h1-sm"></h1></div></li>'
                );
            }

            // Inner Menu Back Hero Clicked
            $('.inner-menu .h1-sm').on('click touch', function () {
                $megaMenu.removeClass('inner-slide-open');
            });
            isDesktop = false;
        }
    };

    // Run The Menu Function
    MenuBuild();

    // Rebuild
    window.onresize = function() {
        if (($(window).width() >= 768 & (isDesktop == false)) || ($(window).width() <= 767 & (isDesktop == true))) {
            MenuBuild();
            console.log("Switch");
        }
    };
});
