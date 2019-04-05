---
layout: intro
title: CSRMaps maps for everyone everywhere.
tagline: Addressing your needs.
---


# Multi-plataforma para divulgação de mapas e análises em tempo real

{% include youtubePlayer.html id=_Qc2PShX8-I %}

1: Um video bonitinho no inicio mostrando projetos e interações interessantes com uma pessoa fazendo e tal.
    Parte 1:
        Mostrar varias plataformas possiveis de criar.
    Parte 2:
        Mostrar interagindo com mapa mudando valores.
    Parte 3:
        Mostrar q ja tem dados, mas q pode mostrar outras fontes.
    Parte 4:
        Mostrar q pode usar em qlqr projeto.
    Parte 5:
        Logo do CSRMaps, (make it ease)
        
## Map interactions

        <div class="category-section">
          <div class="container">
            <h2 class="post-category">Examples</h2>
            <div class="post-list" itemscope="" itemtype="http://schema.org/Blog">

              {% assign sortedExamples = site.examples | sort: 'title' %}
              {% for post in sortedExamples %}
                {% include card.html %}
              {% endfor %}

              <!-- {% include pagination.html %} -->
            </div>
          </div>
        </div>

2: Abaixo vários dos tipos de simulações/exibições possíveis. (video OU Gif ou algo do tipo, 1 pra kda exemplo)
    Aqui pensando em: Simulação de valores, Mudando cor do mapa(Aplicando diferentes legendas), Mudanças ao longo do tempo (timeline), Filtro de valores (altura por ex), Soma de uma região, Selecionando transição (Sankey).
    Em baixo categorias por finalidade do mapa a ser mostrado: Estoques de carbono, População, Hidrografia, Area de endemia, Altimetria. (meio q tentando dizer q todas essas podem ser facilmente representadas)
    Aqui ja ter um link para MAIS... para a documentação
3: Dados disponibilizados no nosso servidor e como podem ser utilizados em outros projetos.
    Conjunto de dados validados verificados e com metadado, resultado de pesquisa mtos anos do CSR
    Facilidade de publicação + estilização com QGIS.
4: Falar da licença livre e tal e como instalar e preparar o ambiente. (Que ao clicar nessa referencia vai para a pagina com os detalhes)
    Publicação, tipos de mapas, limitações com cada tipo, RAW Maps, referencia para a API, Formato do SLD, Config e Config toml.


Sleek is a modern Jekyll theme focused on speed performance & SEO best practices. You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](http://jekyllrb.com/) or simply read the guide on how to [get started](/getting-started)

You can find the source code for the Jekyll new theme at:
[sleek](https://github.com/janczizikow/sleek)

You can find the source code for Jekyll at
[jekyll](https://github.com/jekyll/jekyll)
