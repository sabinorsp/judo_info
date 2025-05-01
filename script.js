document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return; // Se não houver div de conteúdo, não executa o script

    const navLinks = document.querySelectorAll('nav a[data-content]');
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

    // Função para carregar o conteúdo do arquivo Markdown
    async function loadContent(fileName) {
        try {
            // Ajusta o caminho baseado na localização atual
            const basePath = window.location.pathname.includes('views') ? '../' : '';
            
            // Se o fileName contém um caminho, adiciona o prefixo 'conteudo/' se necessário
            let filePath = fileName;
            if (fileName.includes('/')) {
                filePath = fileName.startsWith('conteudo/') ? fileName : `conteudo/${fileName}`;
            } else {
                filePath = `conteudo/${fileName}.md`;
            }
            
            const response = await fetch(`${basePath}${filePath}`);
            if (!response.ok) throw new Error('Arquivo não encontrado');
            const text = await response.text();
            return text;
        } catch (error) {
            console.error('Erro ao carregar o conteúdo:', error);
            return '# Conteúdo não disponível\n\nDesculpe, este conteúdo ainda não está disponível.';
        }
    }

    // Função para converter Markdown para HTML
    function markdownToHtml(markdown, currentPath = '') {
        // Ajusta os caminhos das imagens
        let html = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            // Se o caminho da imagem for relativo, adiciona o caminho base
            if (!src.startsWith('http') && !src.startsWith('/')) {
                // Constrói o caminho absoluto para a imagem
                const basePath = window.location.pathname.includes('views') ? '../' : '';
                src = `${basePath}conteudo/${currentPath}${src}`;
            }
            return `<img src="${src}" alt="${alt}">`;
        });

        // Converte links markdown para HTML
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
            return `<a href="${url}">${text}</a>`;
        });

        // Converte títulos
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        
        // Converte parágrafos
        html = html.replace(/^(?!<h[1-3]|<ul|<ol|<li|<a)(.*$)/gm, '<p>$1</p>');
        
        // Converte listas
        html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        
        return html;
    }

    // Função para carregar e exibir o conteúdo
    async function displayContent(fileName) {
        const markdown = await loadContent(fileName);
        // Extrai o caminho base do nome do arquivo
        const currentPath = fileName.includes('/') ? fileName.substring(0, fileName.lastIndexOf('/') + 1) : '';
        const html = markdownToHtml(markdown, currentPath);
        contentDiv.innerHTML = html;

        // Adiciona eventos aos links internos
        contentDiv.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href.endsWith('.md')) {
                    // Remove o prefixo 'conteudo/' se existir
                    const cleanPath = href.replace('conteudo/', '');
                    const markdown = await loadContent(cleanPath);
                    const currentPath = cleanPath.includes('/') ? cleanPath.substring(0, cleanPath.lastIndexOf('/') + 1) : '';
                    const html = markdownToHtml(markdown, currentPath);
                    contentDiv.innerHTML = html;
                }
            });
        });
    }

    // Adiciona eventos de clique aos links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const content = e.target.getAttribute('data-content');
            // Converte o nome do conteúdo para o nome do arquivo correto
            const fileName = content === 'principles' ? 'principios' : 'tecnicas';
            displayContent(fileName);
        });
    });

    // Carrega o conteúdo inicial baseado na página atual
    if (currentPage === 'principios') {
        displayContent('principios');
    } else if (currentPage === 'tecnicas') {
        displayContent('tecnicas');
    }
}); 