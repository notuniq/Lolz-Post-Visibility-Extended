// ==UserScript==
// @name         Lolz Post Visibility Extended (Self Profile Only)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Локальное скрытие постов в своём профиле
// @author       https://lolz.live/unique
// @match        https://lolz.live/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const isOwnProfile = document.querySelector('a[href="account/personal-details"].button.block');
    if (!isOwnProfile) return; 

    function waitForElements(selector, callback) {
        const observer = new MutationObserver(() => {
            const elements = document.querySelectorAll(selector);
            if (elements.length) {
                callback(elements);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElements('.secondaryContent.blockLinksList', (menus) => {
        menus.forEach((menu) => {
            const postContainer = menu.closest('li[id^="profile-post-"]');
            if (!postContainer) return;

            const postId = postContainer.id;
            const messageMeta = postContainer.querySelector('.messageMeta');
            const commentBlock = postContainer.querySelector('.messageResponse');

            const togglePostBtn = document.createElement('a');
            togglePostBtn.textContent = 'Скрыть';
            togglePostBtn.style.cursor = 'pointer';
            togglePostBtn.className = 'OverlayTrigger';

            let hidden = false;

            togglePostBtn.addEventListener('click', (e) => {
                e.preventDefault();
                hidden = !hidden;

                postContainer.style.opacity = hidden ? '0.3' : '1';
                togglePostBtn.textContent = hidden ? 'Вернуть' : 'Скрыть';

            });

            menu.appendChild(togglePostBtn);

            if (commentBlock) {
                commentBlock.style.display = 'none';

                const showCommentsLi = document.createElement('li');
                const showCommentsBtn = document.createElement('a');
                showCommentsBtn.className = 'commentMore CommentLoader';
                showCommentsBtn.textContent = 'Показать комментарии';
                showCommentsBtn.style.cursor = 'pointer';

                showCommentsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (commentBlock.style.display === 'none') {
                        commentBlock.style.display = '';
                        showCommentsBtn.textContent = 'Скрыть комментарии';
                    } else {
                        commentBlock.style.display = 'none';
                        showCommentsBtn.textContent = 'Показать комментарии';
                    }
                });

                showCommentsLi.appendChild(showCommentsBtn);
                commentBlock.parentElement.insertBefore(showCommentsLi, commentBlock.nextSibling);
            }
        });
    });
})();
