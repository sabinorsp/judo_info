// Função para converter markdown para HTML
function convertMarkdownToHtml(markdown) {
    // Substitui títulos
    markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Substitui parágrafos
    markdown = markdown.replace(/^(?!<h[1-3]|<ul|<li>)(.*$)/gm, '<p>$1</p>');
    
    // Substitui listas
    markdown = markdown.replace(/^\s*-\s(.*$)/gm, '<li>$1</li>');
    markdown = markdown.replace(/<li>.*<\/li>/g, '<ul>$&</ul>');
    
    return markdown;
}

// Carrega o arquivo markdown
fetch('principles.md')
    .then(response => response.text())
    .then(markdown => {
        const content = document.getElementById('content');
        content.innerHTML = convertMarkdownToHtml(markdown);
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo markdown:', error);
        document.getElementById('content').innerHTML = '<p>Erro ao carregar o conteúdo. Por favor, tente novamente mais tarde.</p>';
    }); 