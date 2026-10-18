// hamburger menu for phones
let menuButton = document.querySelector('.menu-toggle');
let navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', function () {
    if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
    } else {
        navLinks.classList.add('open');
        menuButton.setAttribute('aria-expanded', 'true');
    }
});

// close the menu when u click a link otherwise it just sits there covering everything
let allNavLinks = document.querySelectorAll('.nav-links a');
for (let i = 0; i < allNavLinks.length; i++) {
    allNavLinks[i].addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
    });
}

// makes the nav link light up for whatever section ur looking at
// the rootMargin numbers are just random until it worked dont ask
let observer = new IntersectionObserver(function (entries) {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
            let id = entries[i].target.id;
            for (let j = 0; j < allNavLinks.length; j++) {
                if (allNavLinks[j].getAttribute('href') == '#' + id) {
                    allNavLinks[j].classList.add('active');
                } else {
                    allNavLinks[j].classList.remove('active');
                }
            }
        }
    }
}, { rootMargin: '-40% 0px -55% 0px' });

let sections = document.querySelectorAll('main section[id]');
for (let i = 0; i < sections.length; i++) {
    observer.observe(sections[i]);
}

// the image rows thing. each piece needs to know how wide the image is compared to how tall
// so the css can make them all the same height. if u add an image put width and height on it
// or it will look scuffed for like half a second
let pieces = document.querySelectorAll('.justified .piece');
for (let i = 0; i < pieces.length; i++) {
    let piece = pieces[i];
    let img = piece.querySelector('img');

    let w = img.getAttribute('width');
    let h = img.getAttribute('height');
    if (w && h) {
        piece.style.setProperty('--r', w / h);
    }

    // backup for when i forget the width/height (i will forget)
    img.addEventListener('load', function () {
        piece.style.setProperty('--r', img.naturalWidth / img.naturalHeight);
    });
}


// ---------------- IMAGE VIEWER ----------------
// anything with data-gallery="pic1.png|pic2.png" opens this
// this was by far the most annoying part of the whole site

let viewer = document.querySelector('.viewer');
let viewerTitle = document.querySelector('.viewer-title');
let viewerCaption = document.querySelector('.viewer-caption');
let viewerCount = document.querySelector('.viewer-count');
let viewerImg = document.querySelector('.viewer-image');
let viewerStage = document.querySelector('.viewer-stage');
let viewerStrip = document.querySelector('.viewer-strip');
let prevButton = document.querySelector('.viewer-prev');
let nextButton = document.querySelector('.viewer-next');
let closeButton = document.querySelector('.viewer-close');

let images = [];
let currentImage = 0;
let lastClicked = null;
let zoom = 1;
let moveX = 0;
let moveY = 0;

function updateZoom() {
    viewerImg.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px) scale(' + zoom + ')';
    if (zoom > 1) {
        viewerImg.style.cursor = 'grab';
    } else {
        viewerImg.style.cursor = 'zoom-in';
    }
}

function resetZoom() {
    zoom = 1;
    moveX = 0;
    moveY = 0;
    updateZoom();
}

function showImage(number) {
    // wraps around so going past the last one goes back to the first
    if (number < 0) number = images.length - 1;
    if (number >= images.length) number = 0;
    currentImage = number;

    resetZoom();
    viewerImg.src = images[currentImage];
    viewerImg.alt = viewerTitle.textContent;

    if (images.length > 1) {
        viewerCount.textContent = (currentImage + 1) + ' / ' + images.length;
    } else {
        viewerCount.textContent = '';
    }

    let thumbs = viewerStrip.querySelectorAll('button');
    for (let i = 0; i < thumbs.length; i++) {
        if (i == currentImage) {
            thumbs[i].setAttribute('aria-current', 'true');
            thumbs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } else {
            thumbs[i].setAttribute('aria-current', 'false');
        }
    }
}

function openViewer(gallery, title, caption) {
    images = gallery;
    lastClicked = document.activeElement;
    viewerTitle.textContent = title;
    viewerCaption.textContent = caption;

    // no arrows or thumbnails if theres only one pic
    if (images.length > 1) {
        prevButton.hidden = false;
        nextButton.hidden = false;
        viewerStrip.hidden = false;
        let html = '';
        for (let i = 0; i < images.length; i++) {
            html += '<button type="button" aria-label="Image ' + (i + 1) + '"><img src="' + images[i] + '" alt=""></button>';
        }
        viewerStrip.innerHTML = html;
    } else {
        prevButton.hidden = true;
        nextButton.hidden = true;
        viewerStrip.hidden = true;
        viewerStrip.innerHTML = '';
    }

    viewer.hidden = false;
    document.body.style.overflow = 'hidden'; // stops the page scrolling behind it
    showImage(0);
    closeButton.focus();
}

function closeViewer() {
    viewer.hidden = true;
    document.body.style.overflow = '';
    viewerImg.src = '';
    if (lastClicked) lastClicked.focus();
}

document.addEventListener('click', function (e) {
    let clicked = e.target.closest('[data-gallery]');
    if (!clicked) return;
    if (viewer.contains(clicked)) return;

    let caption = '';
    let captionSpan = clicked.querySelector('.piece-caption span');
    if (captionSpan) caption = captionSpan.textContent;

    openViewer(clicked.dataset.gallery.split('|'), clicked.dataset.title || '', caption);
});

viewerStrip.addEventListener('click', function (e) {
    let thumb = e.target.closest('button');
    if (!thumb) return;
    let thumbs = Array.from(viewerStrip.children);
    showImage(thumbs.indexOf(thumb));
});

prevButton.addEventListener('click', function () {
    showImage(currentImage - 1);
});

nextButton.addEventListener('click', function () {
    showImage(currentImage + 1);
});

closeButton.addEventListener('click', closeViewer);

// click the dark part around the pic to close it
viewerStage.addEventListener('click', function (e) {
    if (e.target == viewerStage) closeViewer();
});

document.addEventListener('keydown', function (e) {
    if (viewer.hidden) return;
    if (e.key == 'Escape') closeViewer();
    if (e.key == 'ArrowLeft' && images.length > 1) showImage(currentImage - 1);
    if (e.key == 'ArrowRight' && images.length > 1) showImage(currentImage + 1);
});


// zoom + drag stuff. click to zoom, scroll wheel zooms, drag to move around
// on phones u swipe to change pics
// i rewrote this like 4 times and its still kinda jank but it works so im not touching it

let dragStart = null;
let didDrag = false;

viewerImg.addEventListener('dragstart', function (e) {
    e.preventDefault(); // otherwise chrome tries to drag the actual image file lol
});

viewerImg.addEventListener('click', function () {
    if (didDrag) return; // so letting go of a drag doesnt count as a click
    if (zoom > 1) {
        resetZoom();
    } else {
        zoom = 2;
        updateZoom();
    }
});

viewerStage.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (e.deltaY < 0) {
        zoom = zoom + 0.2;
    } else {
        zoom = zoom - 0.2;
    }
    if (zoom > 4) zoom = 4;
    if (zoom < 1) zoom = 1;
    if (zoom == 1) {
        moveX = 0;
        moveY = 0;
    }
    updateZoom();
}, { passive: false });

viewerImg.addEventListener('pointerdown', function (e) {
    didDrag = false;
    dragStart = { x: e.clientX, y: e.clientY, startX: moveX, startY: moveY };
    viewerImg.setPointerCapture(e.pointerId);
});

viewerImg.addEventListener('pointermove', function (e) {
    if (!dragStart) return;
    if (zoom == 1) return;
    let dx = e.clientX - dragStart.x;
    let dy = e.clientY - dragStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) didDrag = true;
    moveX = dragStart.startX + dx;
    moveY = dragStart.startY + dy;
    updateZoom();
});

viewerImg.addEventListener('pointerup', function (e) {
    // swipe = moved more than 50px sideways while not zoomed in
    if (dragStart && zoom == 1 && images.length > 1) {
        let dx = e.clientX - dragStart.x;
        if (dx < -50) {
            didDrag = true;
            showImage(currentImage + 1);
        } else if (dx > 50) {
            didDrag = true;
            showImage(currentImage - 1);
        }
    }
    dragStart = null;
});
