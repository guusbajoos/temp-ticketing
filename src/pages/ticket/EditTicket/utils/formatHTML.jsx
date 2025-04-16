export const formatHTMLDescription = (value) => {
  const div = document.createElement('div');
  div.innerHTML = value;

  const blockquote = div.querySelectorAll('blockquote');

  blockquote.forEach((quote) => {
    const newQElement = document.createElement('q');
    newQElement.innerHTML = quote.innerHTML;
    quote.parentNode.replaceChild(newQElement, quote);
  });

  const paragraphs = div.querySelectorAll('p');
  const links = div.querySelectorAll('a');

  links.forEach((link) => {
    link.classList.add('text-primary');
  });

  paragraphs.forEach((paragraph) => {
    if (
      paragraph.textContent.trim() === '' ||
      paragraph.innerHTML.trim() === '<br>'
    ) {
      paragraph.remove();
    }
  });

  const ulElements = div.querySelectorAll('ul');
  ulElements.forEach((ul) => {
    ul.style.listStyleType = 'disc';
    const listItems = ul.querySelectorAll('li');
    listItems.forEach((li) => {
      li.classList.add('list-style-description');
    });
  });

  const olElements = div.querySelectorAll('ol');
  olElements.forEach((ol) => {
    ol.style.listStyleType = 'decimal';
    const listItems = ol.querySelectorAll('li');
    listItems.forEach((li) => {
      li.classList.remove('list-style-description');
    });
  });

  const modifiedHtmlString = div.innerHTML;
  return modifiedHtmlString;
};
