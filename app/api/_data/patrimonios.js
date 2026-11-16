// DATASET OFICIAL EXTRAÍDO DO DIAGNÓSTICO SITUACIONAL DA CULTURA - SEMCULT DE PEDRO II - PI
const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const base = [
  {
    id: 1,
    name: 'Igreja Matriz de Nossa Sra. da Conceição',
    category: 'Igrejas e edificações religiosas',
    shortDesc:
      'Localizada na Rua Tertuliano Brandão Filho, nº 467, Centro, Pedro II–PI. Fundada em 1822.',
    description:
      'A Igreja Matriz de Nossa Senhora da Conceição remonta à fundação do povoado Pequizeiro em 1822 por João Alves Pereira, Abel Pereira, Domingos Pereira Dutra, Albino Pereira dos Santos e Antônio da Silva, que edificaram a capela e doaram 1,5 km de terra para o patrimônio da santa. A imagem da padroeira veio diretamente de Portugal.',
    history:
      'Iniciada em 1822 como capela do povoado Pequizeiro, passou por sucessivas reformas ao longo do Império e da República, consolidando-se como o principal templo religioso e marco aglutinador da identidade perdoense.',
    culturalImportance:
      'Palco central dos Festejos de Nossa Senhora da Conceição (28 de novembro a 08 de dezembro) e do tradicional Dia do Vaqueiro em 07 de dezembro.',
    architecture:
      'Alvenaria tradicional com elementos neoclássicos e coloniais, torre sineira frontal e piso histórico.',
    address:
      'Rua Tertuliano Brandão Filho, nº 467, Centro, Pedro II - PI (CEP 64255-000)',
    coordinates: [-4.4251206, -41.4583137],
    yearBuilt: '1822',
    conservation: 'Bom estado de conservação, sob tutela paroquial.',
    curiosities:
      'João Alves Pereira doou um quilômetro e meio de terra para a constituição do patrimônio da Santa.',
    sources:
      'Diagnóstico Situacional da Cultura - SEMCULT de Pedro II - PI. [Google Maps](https://www.google.com/maps/place/Par%C3%B3quia+Nossa+Senhora+da+Concei%C3%A7%C3%A3o/@-4.4251206,-41.4583137,17z)',
    keywords: ['Igreja', 'Matriz', 'Religião', 'Século XIX', 'Tertuliano Brandão'],
    image: img('photo-1548625149-fc4a29cf7092'),
  },
  {
    id: 2,
    name: 'Residência do Alferes Domingos da Silva Mourão',
    category: 'Construções antigas',
    shortDesc:
      'Imponente residência histórica localizada na Rua Domingos Mourão, em frente à Praça da Matriz.',
    description:
      'Antiga residência do Alferes Domingos da Silva Mourão, figura central na história política e social dos primórdios de Pedro II. O casarão reflete a tipologia arquitetônica do período colonial e imperial da região.',
    history:
      'Testemunha da formação urbana em torno da Praça da Matriz e do antigo povoado de Pequizeiro.',
    culturalImportance:
      'Preserva a memória das famílias pioneiras e da arquitetura civil histórica do município.',
    architecture:
      'Casarão tradicional com paredes de adobe/alvenaria espessa, janelas com vergas em arco e pé-direito elevado.',
    address:
      'Rua Domingos Mourão (antiga Rua Domingos da Silva Mourão), em frente à Praça da Matriz, Pedro II - PI',
    coordinates: [-4.4259, -41.458],
    yearBuilt: 'Século XIX',
    conservation: 'Preservado com adaptações funcionais.',
    curiosities:
      'Localizado estrategicamente frente ao principal núcleo religioso e civil da vila.',
    sources: 'Secretaria Municipal de Cultura (SEMCULT) de Pedro II.',
    keywords: ['Alferes', 'Domingos da Silva Mourão', 'Casarão', 'Arquitetura Colonial'],
    image: img('photo-1568605117036-5fe5e7bab0b7'),
  },
  {
    id: 3,
    name: 'Casarão do Cel. Domingos Mourão Filho (Solar da Estrela Marrom)',
    category: 'Patrimônios históricos',
    shortDesc:
      'Localizado na Praça Domingos Mourão Filho, Centro, Pedro II–PI. Coordenadas: -4.4262103, -41.4584380.',
    description:
      'O Solar da Estrela Marrom, antigo casarão do Coronel Domingos Mourão Filho, destaca-se na paisagem urbana da praça principal, representando o apogeu econômico e político do ciclo histórico municipal.',
    history:
      'Construção centenária associada a lideranças políticas e tradicionais da história de Pedro II.',
    culturalImportance:
      'Referência visual e histórica do Centro Histórico, abrigando memórias das elites agrárias e comerciais do século XIX e XX.',
    architecture:
      'Arquitetura eclética com traços coloniais, amplos salões internos e fachada imponente voltada para a praça.',
    address: 'Praça Domingos Mourão Filho, Centro, Pedro II–PI (CEP 64255-000)',
    coordinates: [-4.4262103, -41.458438],
    yearBuilt: 'Século XIX / XX',
    conservation: 'Bom estado de preservação arquitetônica.',
    curiosities: 'Situado no coração da praça que homenageia a mesma família ilustre.',
    sources:
      'Diagnóstico Situacional da Cultura (SEMCULT). [Google Maps](https://www.google.com/maps/place/Solar+da+Estrela+Marrom/@-4.4262103,-41.458438,17z)',
    keywords: ['Casarão', 'Coronel Domingos Mourão Filho', 'Solar', 'Estrela Marrom'],
    image: img('photo-1579783902614-a3fb3927b675'),
  },
  {
    id: 4,
    name: 'Sede da Associação Rural, atual Secretaria de Agricultura',
    category: 'Espaços culturais',
    shortDesc:
      'Rua Vereador Agostinho Pinheiro dos Santos, nº 345, Centro, ao lado da Praça da Matriz, Pedro II–PI.',
    description:
      'Antiga sede da Associação Rural de Pedro II, hoje abrigando a Secretaria Municipal de Agricultura, Abastecimento e Irrigação. Edificação de relevância administrativa e comunitária junto ao centro histórico.',
    history:
      'Construída para dar suporte às atividades produtivas rurais, associativismo e fomento agropecuário do município.',
    culturalImportance:
      'Ponto de referência para produtores rurais, feirantes e ações de desenvolvimento sustentável.',
    architecture:
      'Edificação institucional tradicional com salas de atendimento e pátio integrado.',
    address:
      'Rua Vereador Agostinho Pinheiro dos Santos, nº 345, Centro, Pedro II–PI (CEP 64255-000)',
    coordinates: [-4.4253525, -41.4566598],
    yearBuilt: 'Meados do século XX',
    conservation: 'Ativo e em pleno funcionamento institucional.',
    curiosities: 'Localizado estrategicamente ao lado da Praça da Matriz.',
    sources:
      'Prefeitura Municipal de Pedro II e SEMCULT. [Google Maps](https://www.google.com/maps/place/Secretaria+de+Agricultura+Abastecimento+e+Irriga%C3%A7%C3%A3o/@-4.4253525,-41.4566598,17z)',
    keywords: ['Associação Rural', 'Secretaria de Agricultura', 'Agostinho Pinheiro'],
    image: img('photo-1519331379826-f10be5486c6f'),
  },
  {
    id: 5,
    name: 'Pinacoteca Marechal das Artes',
    category: 'Espaços culturais',
    shortDesc:
      'Espaço cultural de fomento às artes plásticas, exposições e preservação da memória artística local.',
    description:
      'A Pinacoteca Marechal das Artes abriga acervos pictóricos e escultóricos que valorizam a produção artística de Pedro II e do Piauí.',
    history:
      'Criada para abrigar obras doadas por artistas locais e consagrados no cenário nacional.',
    culturalImportance: 'Ponto de encontro para acadêmicos, estudantes e turistas.',
    architecture: 'Edificação adaptada com salas expositivas climatizadas.',
    address: 'Centro Histórico, Pedro II - PI',
    coordinates: [-4.425, -41.4515],
    yearBuilt: '2008',
    conservation: 'Excelente estado de preservação.',
    curiosities: 'Mantém exposições permanentes sobre o garimpo da opala.',
    sources: 'Secretaria Municipal de Cultura (SEMCULT).',
    keywords: ['Pinacoteca', 'Arte', 'Pintura', 'Cultura'],
    image: img('photo-1579783902614-a3fb3927b675'),
  },
  {
    id: 6,
    name: 'Clube 11 de Agosto',
    category: 'Patrimônios históricos',
    shortDesc:
      'Tradicional clube social da cidade, palco de bailes, tertúlias e eventos cívicos históricos.',
    description:
      'Batizado em alusão à data magna de emancipação política do município (11 de agosto de 1854), o Clube 11 de Agosto é o clube social mais emblemático de Pedro II.',
    history: 'Fundado em meados do século XX como ponto central da vida recreativa.',
    culturalImportance: 'Preserva a memória imaterial dos bailes de gala e festividades.',
    architecture: 'Arquitetura retro com amplo salão de festas.',
    address: 'Rua Principal, Centro, Pedro II - PI',
    coordinates: [-4.424, -41.4525],
    yearBuilt: '1962',
    conservation: 'Bom estado, mantendo uso comunitário.',
    curiosities: 'Recebeu autoridades estaduais nos Festivais de Inverno.',
    sources: 'Diagnóstico Situacional da Cultura (SEMCULT).',
    keywords: ['Clube', '11 de Agosto', 'Social', 'Baile'],
    image: img('photo-1519331379826-f10be5486c6f'),
  },
  {
    id: 7,
    name: 'Mercado do Artesão',
    category: 'Espaços culturais',
    shortDesc:
      'Centro de comercialização da Renda de Bilro, joias em opala e rica gastronomia local.',
    description:
      'O Mercado do Artesão é o epicentro do turismo cultural e de compras em Pedro II, com Renda de Bilro e pratos como leitoa assada e carne de bode.',
    history: 'Estabelecido para concentrar e valorizar os saberes tradicionais.',
    culturalImportance: 'Fundamental para a economia criativa e artesanato utilitário.',
    architecture: 'Arquitetura integrada com boxes comerciais.',
    address: 'Próximo à Praça da Matriz, Centro, Pedro II - PI',
    coordinates: [-4.4258, -41.454],
    yearBuilt: '2001',
    conservation: 'Excelente estado e funcionamento diário.',
    curiosities: 'A Renda de Bilro é Patrimônio Cultural Imaterial do Piauí.',
    sources: 'SEMCULT e Associação de Artesãos.',
    keywords: ['Mercado', 'Artesanato', 'Renda de Bilro', 'Opala'],
    image: img('photo-1615529162924-f8605388461d'),
  },
  {
    id: 8,
    name: 'Cachoeira do Salto Liso',
    category: 'Pontos turísticos naturais',
    shortDesc:
      "Queda d'água cristalina cercada por paredões de rocha e vegetação exuberante.",
    description:
      'Com queda de 25 metros, a Cachoeira do Salto Liso é um dos refúgios naturais mais belos de Pedro II.',
    history: 'Conhecida tradicionalmente por moradores e tropeiros.',
    culturalImportance: 'Símbolo da riqueza paisagística da Serra dos Matões.',
    architecture: 'Formação natural em arenito.',
    address: 'Zona Rural, Pedro II - PI',
    coordinates: [-4.38, -41.42],
    yearBuilt: 'Formação natural',
    conservation: 'Preservada com restrições ambientais.',
    curiosities: 'Rocha perfeitamente polida pela força das águas.',
    sources: 'Secretaria de Turismo.',
    keywords: ['Cachoeira', 'Salto Liso', 'Natureza'],
    image: img('photo-1432821596592-e2c18b78144f'),
  },
  {
    id: 9,
    name: 'Mirante O Gritador',
    category: 'Pontos turísticos naturais',
    shortDesc:
      'Mirante espetacular a mais de 700 metros de altitude com vista panorâmica.',
    description:
      'Principal mirante natural de Pedro II na Serra dos Matões, com vista fantástica para o horizonte piauiense.',
    history: 'Local histórico de parada para tropeiros.',
    culturalImportance: 'Cartão-postal máximo do ecoturismo municipal.',
    architecture: 'Mirante com decks de madeira.',
    address: 'Serra dos Matões, Pedro II - PI',
    coordinates: [-4.3512, -41.4019],
    yearBuilt: 'Formação natural',
    conservation: 'Preservado com infraestrutura.',
    curiosities: 'O eco nos paredões deu origem à lenda do Gritador.',
    sources: 'SEMCULT.',
    keywords: ['Mirante', 'Gritador', 'Serra'],
    image: img('photo-1464822759023-fed622ff2c3b'),
  },
];

export const patrimoniosSeed = base.map((p) => ({ ...p, gallery: [p.image] }));

export const categorias = [
  'Patrimônios históricos',
  'Construções antigas',
  'Igrejas e edificações religiosas',
  'Pontos turísticos naturais',
  'Espaços culturais',
  'Monumentos',
];
