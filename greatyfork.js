// ==UserScript==
// @name         Lolz Post Visibility Extended (Self Profile Only)
// @namespace    https://lolz.live/unique
// @version      1.3
// @description  Локальное скрытие постов и комментариев только в своём профиле на lolz.live
// @author       https://lolz.live/unique
// @license      MIT
// @match        https://lolz.live/*
// @icon         https://lolz.live/favicon.ico
// @grant        none
// @run-at       document-end
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

            const commentBlock = postContainer.querySelector('.messageResponse');
            const messageMeta = postContainer.querySelector('.messageMeta');

            const togglePostBtn = document.createElement('a');
            togglePostBtn.textContent = 'Скрыть';
            togglePostBtn.className = 'OverlayTrigger';
            togglePostBtn.style.cursor = 'pointer';

            let hidden = false;

            togglePostBtn.addEventListener('click', (e) => {
                e.preventDefault();
                hidden = !hidden;
                postContainer.style.opacity = hidden ? '0.3' : '1';
                togglePostBtn.textContent = hidden ? 'Вернуть' : 'Скрыть';
                hiddenIcon.style.display = hidden ? '' : 'none';
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
                    const isHidden = commentBlock.style.display === 'none';
                    commentBlock.style.display = isHidden ? '' : 'none';
                    showCommentsBtn.textContent = isHidden ? 'Скрыть комментарии' : 'Показать комментарии';
                });

                showCommentsLi.appendChild(showCommentsBtn);
                commentBlock.parentElement.insertBefore(showCommentsLi, commentBlock.nextSibling);
            }
        });
    });
})();
