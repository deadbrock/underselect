import { STORE_NAME } from '@shared/constants/store-navigation';
import { STORE_LEGAL } from '@shared/constants/legal.constants';

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface LegalDocumentContent {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocumentContent = {
  title: 'Política de Privacidade',
  description:
    'Como a UNDER SELECT coleta, utiliza e protege seus dados pessoais.',
  lastUpdated: STORE_LEGAL.lastUpdated,
  sections: [
    {
      id: 'introducao',
      title: 'Introdução',
      paragraphs: [
        `A ${STORE_NAME} respeita a privacidade dos visitantes e clientes. Esta Política de Privacidade descreve como tratamos dados pessoais em nosso site, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).`,
        'Ao utilizar nossos serviços, você declara estar ciente das práticas descritas neste documento.',
      ],
    },
    {
      id: 'dados-coletados',
      title: 'Dados que coletamos',
      paragraphs: ['Podemos coletar as seguintes informações:'],
      list: [
        'Dados de identificação: nome, e-mail, telefone e CPF, quando necessários para compra ou cadastro.',
        'Dados de entrega e cobrança: endereço, cidade, estado e CEP.',
        'Dados de navegação: páginas visitadas, dispositivo, navegador e cookies (conforme nossa Política de Cookies).',
        'Dados de pedidos: histórico de compras, pagamentos e interações com atendimento.',
      ],
    },
    {
      id: 'finalidades',
      title: 'Como utilizamos seus dados',
      paragraphs: ['Utilizamos os dados pessoais para:'],
      list: [
        'Processar pedidos, pagamentos e entregas.',
        'Criar e gerenciar sua conta na loja.',
        'Enviar comunicações sobre pedidos, atendimento e, quando autorizado, novidades e promoções.',
        'Melhorar a experiência de navegação, segurança e desempenho do site.',
        'Cumprir obrigações legais, fiscais e regulatórias.',
      ],
    },
    {
      id: 'base-legal',
      title: 'Bases legais',
      paragraphs: ['O tratamento de dados pode ocorrer com base em:'],
      list: [
        'Execução de contrato ou procedimentos preliminares relacionados a compras.',
        'Cumprimento de obrigação legal ou regulatória.',
        'Legítimo interesse, como prevenção a fraudes e melhoria dos serviços.',
        'Consentimento, quando aplicável — por exemplo, para newsletter ou cookies não essenciais.',
      ],
    },
    {
      id: 'compartilhamento',
      title: 'Compartilhamento de dados',
      paragraphs: [
        'Não vendemos seus dados pessoais. Podemos compartilhá-los apenas com parceiros necessários à operação da loja, como gateways de pagamento, transportadoras, plataformas de e-mail e ferramentas de analytics, sempre dentro dos limites legais e contratuais.',
        'Também poderemos compartilhar informações quando exigido por autoridade competente ou para proteger nossos direitos.',
      ],
    },
    {
      id: 'direitos',
      title: 'Seus direitos',
      paragraphs: ['De acordo com a LGPD, você pode solicitar:'],
      list: [
        'Confirmação da existência de tratamento e acesso aos dados.',
        'Correção de dados incompletos, inexatos ou desatualizados.',
        'Anonimização, bloqueio ou eliminação de dados desnecessários.',
        'Portabilidade, quando aplicável.',
        'Revogação de consentimento e informações sobre compartilhamentos.',
      ],
    },
    {
      id: 'retencao',
      title: 'Retenção e segurança',
      paragraphs: [
        'Mantemos os dados apenas pelo tempo necessário para cumprir as finalidades descritas nesta política ou exigências legais.',
        'Adotamos medidas técnicas e organizacionais para proteger as informações contra acesso não autorizado, perda ou uso indevido.',
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      paragraphs: [
        `Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato pelo e-mail ${STORE_LEGAL.contactEmail}.`,
        `Endereço de referência: ${STORE_LEGAL.location}.`,
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações desta política',
      paragraphs: [
        'Podemos atualizar este documento periodicamente. Recomendamos revisitar esta página para acompanhar eventuais mudanças.',
        'Alterações relevantes poderão ser comunicadas por meios adequados, como aviso no site ou por e-mail.',
      ],
    },
  ],
};

export const TERMS_OF_USE: LegalDocumentContent = {
  title: 'Termos de Uso',
  description: 'Regras para utilização do site e serviços da UNDER SELECT.',
  lastUpdated: STORE_LEGAL.lastUpdated,
  sections: [
    {
      id: 'aceitacao',
      title: 'Aceitação dos termos',
      paragraphs: [
        `Ao acessar e utilizar o site da ${STORE_NAME}, você concorda com estes Termos de Uso. Se não concordar com qualquer condição, recomendamos não utilizar nossos serviços.`,
      ],
    },
    {
      id: 'sobre',
      title: 'Sobre a loja',
      paragraphs: [
        `${STORE_NAME} é uma loja online especializada em camisas esportivas, seleções e produtos relacionados. Operamos a partir de ${STORE_LEGAL.location}.`,
        'As informações exibidas no site têm caráter informativo e comercial. Reservamo-nos o direito de atualizar conteúdos, preços e disponibilidade sem aviso prévio.',
      ],
    },
    {
      id: 'cadastro',
      title: 'Cadastro e conta',
      paragraphs: [
        'Para realizar compras ou acessar determinadas funcionalidades, pode ser necessário criar uma conta. Você é responsável por manter seus dados corretos e pela confidencialidade de sua senha.',
        'Notifique-nos imediatamente em caso de uso não autorizado da sua conta.',
      ],
    },
    {
      id: 'compras',
      title: 'Produtos, preços e pagamentos',
      paragraphs: [
        'Os preços são exibidos em reais (BRL) e podem ser alterados a qualquer momento. O valor aplicável será o confirmado no momento da finalização do pedido.',
        'Imagens e descrições buscam representar fielmente os produtos, podendo haver pequenas variações de cor ou acabamento conforme o dispositivo utilizado.',
        'Pagamentos são processados por parceiros seguros. A confirmação do pedido depende da aprovação do pagamento.',
      ],
    },
    {
      id: 'entregas',
      title: 'Entregas, trocas e devoluções',
      paragraphs: [
        'Prazos e condições de entrega são informados durante o checkout e podem variar conforme região e transportadora.',
        'Trocas e devoluções seguem a legislação aplicável e nossa política específica, disponível na página de Trocas e Devoluções.',
      ],
    },
    {
      id: 'uso-permitido',
      title: 'Uso permitido',
      paragraphs: ['Ao utilizar o site, você concorda em não:'],
      list: [
        'Violar leis aplicáveis ou direitos de terceiros.',
        'Tentar acessar áreas restritas, sistemas ou dados sem autorização.',
        'Utilizar o site para fins fraudulentos, abusivos ou que prejudiquem a operação da loja.',
        'Reproduzir conteúdos, marcas ou materiais sem autorização.',
      ],
    },
    {
      id: 'propriedade',
      title: 'Propriedade intelectual',
      paragraphs: [
        'Marcas, logotipos, textos, imagens, layout e demais conteúdos do site pertencem à UNDER SELECT ou a seus licenciadores, salvo indicação em contrário.',
        'Marcas de clubes, seleções e fabricantes exibidas no catálogo pertencem aos respectivos titulares.',
      ],
    },
    {
      id: 'responsabilidade',
      title: 'Limitação de responsabilidade',
      paragraphs: [
        'Empregamos esforços para manter o site disponível e seguro, mas não garantimos funcionamento ininterrupto ou livre de erros.',
        'Na extensão permitida pela lei, a UNDER SELECT não se responsabiliza por danos indiretos decorrentes do uso do site, salvo nos casos previstos legalmente.',
      ],
    },
    {
      id: 'alteracoes-termos',
      title: 'Alterações e contato',
      paragraphs: [
        'Estes Termos de Uso podem ser atualizados periodicamente. O uso continuado do site após alterações implica concordância com a versão vigente.',
        `Dúvidas podem ser enviadas para ${STORE_LEGAL.contactEmail}.`,
        `Foro aplicável: comarca de Recife/PE, salvo disposição legal em contrário em relação ao consumidor.`,
      ],
    },
  ],
};

export const COOKIE_POLICY: LegalDocumentContent = {
  title: 'Política de Cookies',
  description: 'Como a UNDER SELECT utiliza cookies e tecnologias similares.',
  lastUpdated: STORE_LEGAL.lastUpdated,
  sections: [
    {
      id: 'o-que-sao',
      title: 'O que são cookies',
      paragraphs: [
        'Cookies são pequenos arquivos armazenados no seu navegador quando você visita um site. Eles ajudam a lembrar preferências, manter sessões ativas e entender como o site é utilizado.',
        'Tecnologias similares, como pixels e armazenamento local, podem ser utilizadas para finalidades equivalentes.',
      ],
    },
    {
      id: 'como-usamos',
      title: 'Como utilizamos cookies',
      paragraphs: [
        `A ${STORE_NAME} utiliza cookies para garantir o funcionamento do site, melhorar a experiência de navegação e, quando aplicável, apoiar ações de marketing e analytics.`,
      ],
    },
    {
      id: 'tipos',
      title: 'Tipos de cookies',
      paragraphs: ['Podemos utilizar as seguintes categorias:'],
      list: [
        'Essenciais: necessários para login, carrinho, checkout e segurança. Sem eles, partes do site podem não funcionar.',
        'Funcionais: permitem lembrar preferências, como idioma ou itens visualizados recentemente.',
        'Analíticos: ajudam a entender o desempenho do site e a melhorar conteúdos e navegação.',
        'Marketing: utilizados para medir campanhas e exibir conteúdos mais relevantes, quando houver consentimento.',
      ],
    },
    {
      id: 'terceiros',
      title: 'Cookies de terceiros',
      paragraphs: [
        'Alguns cookies podem ser definidos por parceiros, como ferramentas de pagamento, analytics ou redes sociais integradas ao site.',
        'Esses terceiros possuem políticas próprias de privacidade e cookies, sobre as quais não temos controle direto.',
      ],
    },
    {
      id: 'gerenciamento',
      title: 'Como gerenciar cookies',
      paragraphs: [
        'Você pode configurar seu navegador para bloquear ou excluir cookies. Consulte as instruções do Chrome, Firefox, Safari, Edge ou do navegador que utiliza.',
        'A desativação de cookies essenciais pode afetar funcionalidades como login, carrinho e finalização de compra.',
        'Quando exigido, solicitaremos consentimento para cookies não essenciais por meio de aviso no site.',
      ],
    },
    {
      id: 'alteracoes-cookies',
      title: 'Alterações e contato',
      paragraphs: [
        'Esta Política de Cookies pode ser atualizada para refletir mudanças tecnológicas ou legais.',
        `Para dúvidas, entre em contato: ${STORE_LEGAL.contactEmail}.`,
      ],
    },
  ],
};
