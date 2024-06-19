// ==UserScript==
// @name         Copy Tweet Button
// @homepageURL  https://github.com/IUseDebianBtw/TweetCopyButton
// @version      1.0
// @description  Adds a button to copy a tweer
// @author       IUseDebianBtw
// @license      GPL-3.0 
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    const iconUrl = 'https://github.com/IUseDebianBtw/TweetCopyButton/blob/main/src/icon.png'; 

    // Function to create the copy button
    function createCopyButton() {
        let button = document.createElement('button');
        button.style.marginLeft = '10px';
        button.style.cursor = 'pointer';
        button.style.border = 'none';
        button.style.background = 'none';
        button.style.display = 'flex';
        button.style.alignItems = 'center';

        let icon = document.createElement('img');
        icon.src = iconUrl;
        icon.style.width = '20px';
        icon.style.height = '20px';
        icon.style.marginRight = '5px';

        let text = document.createElement('span');
        text.innerText = 'Copy Tweet';
        text.style.color = '#1DA1F2';
        text.style.fontWeight = 'bold';

        button.appendChild(icon);
        button.appendChild(text);

        button.onclick = function() {
            let tweetContent = getTweetContent(this);
            copyToClipboard(tweetContent);
        };

        return button;
    }

    // Function to get the content of the tweet
    function getTweetContent(button) {
        let tweet = button.closest('[data-testid="tweet"]');
        let content = tweet.querySelector('[lang]') ? tweet.querySelector('[lang]').innerText : '';
        let pollOptions = tweet.querySelectorAll('[data-testid="voteCount"]');
        if (pollOptions.length > 0) {
            content += '\nPoll Options:\n';
            pollOptions.forEach(option => {
                content += option.innerText + '\n';
            });
        }
        return content;
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        let textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Tweet copied to clipboard');
    }

    // Function to add the copy button to tweets
    function addCopyButtonToTweets() {
        let tweets = document.querySelectorAll('[data-testid="tweet"]');
        tweets.forEach(tweet => {
            if (!tweet.querySelector('.copy-tweet-button')) {
                let actionBar = tweet.querySelector('[role="group"]');
                if (actionBar) {
                    let copyButton = createCopyButton();
                    copyButton.classList.add('copy-tweet-button');
                    actionBar.appendChild(copyButton);
                }
            }
        });
    }


    let observer = new MutationObserver(addCopyButtonToTweets);
    observer.observe(document, { childList: true, subtree: true });

    addCopyButtonToTweets();
})();
