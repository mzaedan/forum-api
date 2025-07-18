/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

function ThreadBody({ body }) {
  // Sanitize the HTML content to prevent XSS attacks
  const cleanHtml = (dirty) => {
    const config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'hr', 'div', 'span',
        'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel'],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|ftp|tel|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i
    };
    return DOMPurify.sanitize(dirty, config);
  };

  // Process the body content
  const processedBody = () => {
    if (!body) return '';
    // Convert newlines to <br> tags and preserve other HTML
    const withLineBreaks = body.replace(/\n/g, '<br>');
    return cleanHtml(withLineBreaks);
  };

  return (
    <div className="thread-content">
      <div className="text-dark lh-lg" style={{ fontSize: '1.1rem' }}>
        {parse(processedBody(), {
          replace: (domNode) => {
            // Add Bootstrap classes to tables for better styling
            if (domNode.name === 'table') {
              domNode.attribs.className = 'table table-bordered table-striped table-hover my-3';
            }
            // Ensure external links open in new tab
            if (domNode.name === 'a' && domNode.attribs.href) {
              domNode.attribs.target = '_blank';
              domNode.attribs.rel = 'noopener noreferrer';
            }
            // Add max-width to images
            if (domNode.name === 'img') {
              domNode.attribs.style = 'max-width: 100%; height: auto;';
            }
          }
        })}
      </div>
    </div>
  );
}

export default ThreadBody;
