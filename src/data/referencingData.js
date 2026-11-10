export const REFERENCING_SECTIONS = [
  {
    id: 'intro',
    num: '1',
    title: 'Introduction to Referencing',
    shortTitle: 'Introduction',
    tabs: [
      {
        id: '1-1',
        tabNum: '1.1',
        title: 'The Importance of Referencing',
        intro: 'Referencing supports the intellectual property rights of others’ work. Therefore, when we use other people’s ideas and work, it is important to acknowledge and cite the original source. In an academic context, failure to adhere to this practice will be considered as plagiarism or academic dishonesty and can result in penalties.',
        paragraphs: [
          'Copying or paraphrasing another person’s work without proper referencing is the most common type of plagiarism and academic dishonesty among college and university students.',
          'Students must give credit to any type of information, ideas, words, study findings, statistics, diagrams, graphs, and photos used in their assignments. Proper referencing also enables readers to locate the original source of the material.'
        ],
        highlights: [
          { title: 'Intellectual Property', desc: 'Acknowledges original authors and respects copyright standards.' },
          { title: 'Academic Honesty', desc: 'Avoids serious academic penalties and disciplinary proceedings.' },
          { title: 'Traceability', desc: 'Allows lecturers and peer researchers to verify your sources independently.' }
        ]
      },
      {
        id: '1-2',
        tabNum: '1.2',
        title: 'About APA Referencing',
        intro: 'Although there are various referencing systems for publications, Discovery Library has adopted the American Psychological Association (APA) style as it is widely recommended for Australian college and university students.',
        paragraphs: [
          'We strictly adhere to the APA’s latest version of the publication manual, which is the APA 7th edition, and we update guidance as soon as revisions become available.',
          'APA style has two main mandatory components: an in-text citation within the body of your paper, and a comprehensive reference list at the end of the document.'
        ],
        callout: {
          badge: 'Standard Edition',
          title: 'Official APA 7th Edition Adopted',
          text: 'Every student submission must maintain internal consistency using APA 7th formatting for both parenthetical/narrative citations and the concluding reference list.'
        }
      },
      {
        id: '1-3',
        tabNum: '1.3',
        title: 'In-Text Citations',
        intro: 'To reference information correctly, use in-text citations within the body of your text. In-text citations acknowledge original authors and provide readers with details about where the information originated. Properly formatted in-text citations enhance the credibility and reliability of your arguments.',
        generalRules: [
          'Insert an in-text citation within the body of the text whenever you directly quote, paraphrase, or summarise information from someone else’s work.',
          'Insert an in-text citation when you use or copy tables, diagrams, pictures, graphs, or statistics.',
          'You do not need to include an in-text citation for every single sentence in a paragraph if it is clear that the entire paragraph discusses the same source. Instead, cite the source in the first sentence and use a narrative approach or additional citations as necessary.'
        ],
        sections: [
          {
            heading: 'Direct Quotations',
            desc: 'When quoting directly word-for-word, include the author’s last name, the year of publication, and the specific page number (or paragraph number for unpaginated web sources). Use double quotation marks around the quoted passage.',
            formats: [
              'Author (Year) “text of direct quote” (Page).',
              '“text of direct quote” (Author & Author, Year, Page).'
            ],
            examples: [
              {
                type: 'Narrative Citation',
                text: 'According to Keller and Aiken (2020), “Effective leadership is crucial in guiding organizational change and ensuring that the strategies implemented align with the overall vision” (p. 50).'
              },
              {
                type: 'Parenthetical Citation',
                text: '“Effective leadership is crucial in guiding organizational change and ensuring that the strategies implemented align with the overall vision” (Keller & Aiken, 2020, p. 50).'
              }
            ]
          },
          {
            heading: 'Paraphrasing & Summarising',
            desc: 'When paraphrasing or summarising information in your own words, include the author’s last name and year of publication. Page numbers are not strictly mandatory, but may be included if it helps the reader locate complex or specific material.',
            formats: [
              'Author (Year) expresses the idea…',
              '…paraphrased idea sentence (Author, Year)',
              '…paraphrased idea sentence (Author & Author, Year)'
            ],
            examples: [
              {
                type: 'Example',
                text: 'Keller and Aiken (2020) discuss the significant impact of leadership on managing organizational change and innovation (p. 50).'
              }
            ],
            notes: [
              'When acknowledging multiple authors in the narrative text of a sentence, precede the final name with the word “and” (e.g., Verma, Getenet, Dann, and Shaik (2023) argue that…).',
              'When acknowledging multiple authors inside parentheses, precede the final name with an ampersand “&” (e.g., …(Verma, Getenet, Dann, & Shaik, 2023)).'
            ]
          }
        ]
      },
      {
        id: '1-4',
        tabNum: '1.4',
        title: 'Reference List',
        intro: 'All references cited in the body text must be included in the reference list, and the list must be placed at the end of the document on a new page. An APA style reference contains detailed information including author, date, title, and source specifics such as publisher, DOI, or URL.',
        generalRules: [
          'Each reference entry must contain the four fundamental elements: Who created the work (Author), When the work was created (Year/Date), What the work is called (Title), and Where to locate the work (Source/Publisher/DOI/URL).',
          'References must be arranged alphabetically by authors’ last names, by the name of the responsible organisation, or by the title if no author is named.',
          'The reference list must begin on a fresh page at the end of your assignment document.',
          'Maintain single-style integrity: do not mix APA with Harvard, MLA, or Chicago in the same submission.',
          'DOIs (Digital Object Identifiers) should always be presented as active hyperlinks starting with “https://doi.org/” followed by the alphanumeric code.'
        ],
        examples: [
          {
            label: 'Book Example',
            citation: 'Al-Worafi, Y. (2022). A guide to online pharmacy education: Teaching strategies and assessment methods (1st ed.). CRC Press. https://doi.org/10.1201/9781003230458',
            note: 'Author listed with surname first, followed by initials. Book title is italicised in sentence case. Edition appears in parentheses. Publisher follows edition, and the DOI is provided in URL format.'
          },
          {
            label: 'Journal Article Example',
            citation: 'Verma, N., Getenet, S. T., Dann, C., & Shaik, T. B. (2023). Designing an artificial intelligence tool to understand student engagement based on teacher’s behaviours and movements in video conferencing. Computer Applications in Engineering Education, 5(3), 100187. https://doi.org/10.1016/j.caeai.2023.100187',
            note: 'Article title is in sentence case; journal title is italicised in title case followed by italicised volume and parenthetical issue number. Article number/pages and DOI URL conclude the entry.'
          }
        ]
      }
    ]
  },
  {
    id: 'books',
    num: '2',
    title: 'Books and eBooks',
    shortTitle: 'Books & eBooks',
    tabs: [
      {
        id: '2-1',
        tabNum: '2.1',
        title: 'Printed Books',
        intro: 'General rules of in-text citation apply directly to physical printed books.',
        inText: {
          directQuote: '“the subject of a sentence typically refers to the person, place, thing, or idea that is performing or being acted upon” (Johnson & Lee, 2022, p. 35)',
          directNote: 'When word-for-word material is quoted directly, the author’s last name, publication year, and exact page number must appear. Double quotation marks enclose the quote.',
          paraphrase: 'The entity performing the action in a sentence is referred to as the subject (Celce-Murcia & Larsen-Freeman, 2020).',
          paraphraseNote: 'When paraphrasing or summarising in your own words, cite the author’s surname and publication year.'
        },
        refFormat: 'Author, A. B. (Year Published). Book name (Edition). City, State: Publisher.',
        examples: [
          { citation: 'Thomson, A. J., & Martinet, A. V. (2021). A practical English grammar (6th ed.). Oxford University Press.' },
          { citation: 'Hewings, M. (2022). Advanced grammar in use: A self-study reference and practice book for advanced learners of English (3rd ed.). Cambridge University Press.' }
        ]
      },
      {
        id: '2-2',
        tabNum: '2.2',
        title: 'eBooks',
        intro: 'General rules of in-text citation apply for ebooks and digital publications.',
        inText: {
          directQuote: '“Adaptation strategies must be flexible and responsive to changing climatic conditions” (Klein & Moser, 2021, p. 103).',
          paraphrase: 'In machine learning, the process of training algorithms involves feeding them large amounts of data to improve their predictive accuracy (Smith & Johnson, 2022).\n— or —\nThaler and Sunstein (2021) describe that behavioral economics explores how psychological factors influence people’s economic decisions and lead to deviations from traditional economic theory.'
        },
        formats: [
          {
            label: 'Reference Format (with DOI)',
            format: 'Author, A. B. (Year Published). Book name (Edition). https://doi.org/xxxxx',
            note: 'Always provide the DOI when available.'
          },
          {
            label: 'Example (with DOI)',
            citation: 'Cabana, D., Rölfer, L., Evadzi, P., & Celliers, L. (2023). Enabling climate change adaptation in coastal systems: A systematic literature review. Earth’s Future, 11, e2023EF003713. https://doi.org/10.1029/2023EF003713'
          },
          {
            label: 'Reference Format (with URL)',
            format: 'Author, A. B. (Year Published). Book name (Edition). URL',
            note: 'Provide the publisher homepage URL when a direct DOI is unavailable.'
          },
          {
            label: 'Example (with URL)',
            citation: 'Russel, S., & Norvig, P. (2021). Artificial intelligence: A modern approach (4th ed.). Retrieved from https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500'
          }
        ]
      },
      {
        id: '2-3',
        tabNum: '2.3',
        title: 'Chapter in an Edited Physical Book',
        intro: 'Use this format when citing an individual chapter written by specific authors within an edited collection curated by separate book editors.',
        refFormat: 'Author, A. B. (Year Published). Title of chapter. In A. A. Editor & B. B. Editor (Eds.), Title of book (pp. #-#). City, State: Publisher.',
        note: 'After the chapter author and year, list the editors with initials preceding surname, followed by (Eds.), book title in italics, page range in parentheses, and the publisher.',
        examples: [
          {
            label: 'Example 1',
            citation: 'Westerman, G., & Bonnet, D. (2021). Leading Digital Transformation: The Role of Leadership in Digital Change. In H. El-Gohary & S. M. R. K. (Eds.), Digital Transformation: Strategies, Technologies, and Business Models (pp. 45-66). London: Routledge.'
          },
          {
            label: 'Example 2',
            citation: 'Colding, J., & Barthel, S. (2023). Resilient Urban Planning for Climate Change. In P. T. J. M. et A. L. (Eds.), Sustainable Urban Development: Challenges and Solutions (Vol. 2, pp. 77-94). Cambridge: Cambridge University Press.'
          }
        ]
      },
      {
        id: '2-4',
        tabNum: '2.4',
        title: 'Chapter in an Edited eBook',
        intro: 'Covers chapters in digital edited volumes, including online e-readers (Kindle, EBL, ProQuest).',
        formats: [
          {
            label: 'Format with DOI',
            format: 'Author, A. B. (Year Published). Title of chapter. In A. B. Editor (Ed.), Title of book (pp. #-#). https://doi.org/xxxxx',
            example: 'Nam, C. S., Jung, J. Y., & Lee, S. (2022). Human-Centered Artificial Intelligence: Research and Applications. Elsevier Inc. https://doi.org/10.1016/C2020-0-02460-6'
          },
          {
            label: 'Format with URL',
            format: 'Author, A. A. (Year Published). Title of chapter. In A. B. Editor (Ed.), Title of book (pp. #-#). URL',
            example: 'Sachs, J. D., & Schmidt-Traub, G. (2022). Pathways to Sustainable Development Goals. In R. M. White & S. P. Davis (Eds.), Global Challenges and Sustainable Development (pp. 89-110). Routledge. https://s3.amazonaws.com/sustainabledevelopment.report/2022/2022-sustainable-development-report.pdf'
          },
          {
            label: 'Format for whole eBook through an e-Reader (Kindle / EBL)',
            format: 'Author, A. B. (Year Published). Title of book [e.g., EBL; Kindle]. URL',
            example: 'Nielsen, M. A., & Chuang, I. L. (2021). Quantum Computation and Quantum Information (11th ed.). Cambridge University Press. https://www.cambridge.org/core/books/quantum-computation-and-quantum-information/7d8e9f6c9e1b8a1f6dae9d4a5b3d'
          },
          {
            label: 'Edited eBook Chapter through an e-Reader',
            format: 'Author, A. B. (Year Published). Title of chapter. In A. B. Editor (Ed.), Title of book [e.g., Kindle ed.] (pp. #-#). https://doi.org/xxxxx',
            example: 'Smith, J. A. (2020). The evolution of social media marketing. In R. B. Thompson (Ed.), Digital marketing strategies (Kindle ed., pp. 45-67). https://doi.org/10.1234/5678'
          }
        ]
      },
      {
        id: '2-5',
        tabNum: '2.5',
        title: 'Dictionary and Encyclopaedia',
        intro: 'Unique rules apply when citing reference dictionaries and encyclopaedias in print and digital forms.',
        rules: [
          'Indicate edition and volume number for a print copy.',
          'Do not indicate edition if it is the first edition.',
          'Begin with the title of the entry/article when no personal author is credited.',
          'Add a DOI at the end of the reference when available.',
          'Pagination and volume numbers must be enclosed in parentheses.'
        ],
        examples: [
          {
            type: 'Print Reference',
            format: 'Author, A. B. (Year Published). Article title. In A. A. Editor (Ed.), Name of dictionary/encyclopedia (Vol. #, pp. #-#). City, State: Publisher.',
            citation: 'Stanford Encyclopedia of Philosophy (2023). In E. N. Zalta (Ed.), Stanford Encyclopedia of Philosophy (2023). Stanford University. https://plato.stanford.edu/'
          },
          {
            type: 'Online with URL',
            citation: 'Encyclopedia of Environmental Health (2022). In J. S. & G. S. (Eds.), Encyclopedia of Environmental Health (2nd ed.). Elsevier. https://www.elsevier.com/en-xm/books-and-journals/book/9780128190863'
          },
          {
            type: 'Online with DOI',
            citation: 'Encyclopedia of Global Health (2021). In H. S. & M. L. (Eds.), Encyclopedia of Global Health (2nd ed.). Springer. https://doi.org/10.1007/978-3-319-55150-0'
          }
        ]
      }
    ]
  },
  {
    id: 'internet',
    num: '3',
    title: 'Internet Sources',
    shortTitle: 'Internet Sources',
    tabs: [
      {
        id: '3-1',
        tabNum: '3.1',
        title: 'About Internet Sources',
        intro: 'The Internet provides information across multiple formats: web pages, online documents, blogs, social media posts, podcasts, and streaming video. While Discovery Library encourages students to research widely, you must critically evaluate every online source using standard scholarly criteria.',
        criteria: [
          { label: 'Accuracy', text: 'Does the page provide references, bibliographies, or primary evidence that substantiates the origins of the data?' },
          { label: 'Authority', text: 'Who is the author or sponsoring organisation? Are they subject-matter specialists or accredited academic bodies?' },
          { label: 'Currency', text: 'Is the information up-to-date? When was the page written or last updated?' },
          { label: 'Purpose', text: 'Is the material educational and balanced, or is it promotional, biased, or commercial marketing?' },
          { label: 'The URL', text: 'Is the domain reputable (e.g., .gov.au, .edu.au, recognized international agencies, or top industry publishers)?' }
        ],
        note: 'Inaccurate or missing online citations still constitute plagiarism. Sections 3.2 through 3.6 illustrate the correct formats for all types of web materials.'
      },
      {
        id: '3-2',
        tabNum: '3.2',
        title: 'Webpage on a Website',
        intro: 'Covers standalone pages on commercial, government, educational, and news websites.',
        inText: {
          directQuote: '“The students must use the library’s reference guides” (Anderson, para. 1).',
          note: 'When page numbers are absent on web pages, use para. and the paragraph number.',
          paraphrase: 'Anderson (2019) recommended the library’s reference guides.'
        },
        formats: [
          {
            label: 'Format with Corporate Author (Publisher Distinct)',
            format: 'Corporate author. (Year, Month DD). Title of webpage. Publisher. URL',
            examples: [
              {
                citation: 'APA Style. (2019). Plagiarism. American Psychological Association. https://apastyle.apa.org/style-grammar-guidelines/citations/plagiarism'
              },
              {
                citation: 'Study in Australia. (2019). Scholarships to study in Australia. Australian Trade and Investment Commission. Retrieved December 6, 2019, from https://www.studyinaustralia.gov.au/English/Australian-Education/Scholarships'
              }
            ],
            note: 'When personal author is not available, use the organization name. Do not italicise standard webpage titles. Include retrieval date only when content is frequently updated or unstable.'
          },
          {
            label: 'Format with Corporate Author (Author & Publisher Identical)',
            format: 'Corporate author. (Year, Month DD). Title of webpage. URL',
            examples: [
              { citation: 'Australian Research Council. (2019, December 4). Grants. https://www.arc.gov.au/grants' },
              { citation: 'Mater Foundation. (2019). Team Smiddy raise more than $440 000 for cancer research at Mater. https://www.materfoundation.org.au/what-we-do/news/november-2019/team-smiddy-raise-more-than-440-000-for-cancer-re' }
            ],
            note: 'Omit the publisher name when it is identical to the corporate author to avoid redundant repetition.'
          },
          {
            label: 'Format with Personal Author',
            format: 'Author, A. B. (Year, Month DD). Title of webpage. Publisher. Retrieved Month DD, Year, from URL',
            examples: [
              { citation: 'Chan, J. (2019, February 15). No plan = no customers: How to build a profitable marketing strategy. Foundr Magazine. Retrieved November 4, 2019, from https://foundr.com/marketing-strategy' }
            ]
          },
          {
            label: 'Website News Article',
            format: 'Author, A. B. (Year, Month DD). Title of webpage. Publisher. URL',
            examples: [
              { citation: 'McGhee, R. (2019, November 1). Abandoned Great Barrier Reef island resurrected into eco-friendly luxury holiday destination. ABC News. https://www.abc.net.au/news/2019-11-01/wilson-island-reopened-as-eco-friendly-great-barrier-reef-resort/11661510' }
            ],
            note: 'When online news articles do not belong to daily or weekly print newspapers, format them as a webpage on a website.'
          }
        ]
      },
      {
        id: '3-3',
        tabNum: '3.3',
        title: 'Blog Posts',
        intro: 'Guidelines for citing authoritative industry blogs and blog comment threads.',
        inText: {
          directQuote: '“The students must use the library’s reference guides” (Anderson, para. 1).',
          paraphrase: 'Anderson (2019) recommended the library’s reference guides.'
        },
        formats: [
          {
            label: 'Blog Post Format',
            format: 'Author, A. B. (Year, Month DD). Title [Web blog post]. URL',
            examples: [
              { citation: 'Morphett, J. (2019, October 22). SEO analytics for free – combining Google search with the Moz API [Web blog post]. https://moz.com/blog/combining-google-search-with-moz-api' }
            ]
          },
          {
            label: 'Comment on a Blog Post',
            format: 'Author, A. B. (Year, Month DD). Re: Title [Blog comment]. URL',
            examples: [
              { citation: 'Polgar, G. (2017, November 11). Re: Why do many of us still think that species are real [Blog comment]. https://www.researchgate.net/post/Why_do_many_of_us_still_think_that_species_are_real' }
            ]
          }
        ]
      },
      {
        id: '3-4',
        tabNum: '3.4',
        title: 'Social Media',
        intro: 'Covers public posts on platforms including Facebook, Twitter (X), and Instagram.',
        inText: {
          directQuote: '“The students must use the library’s reference guides” (Anderson, para. 1).',
          paraphrase: 'Anderson (2019) recommended the library’s reference guides.'
        },
        formats: [
          {
            label: 'Facebook Post Format',
            format: 'Author, A. B. (Year, Month DD). Title. Facebook. URL',
            examples: [
              { citation: '[Institution Name]. (2025, February 21). Introducing our institution – your gateway to practical, high-quality education and training! [Facebook post]. https://www.facebook.com/xxxxx/xxxxxx/xxx' }
            ],
            note: 'Use the author or organisation name. Use up to the first 20 words of the post as the title in italics. Note attachments in brackets like [Image attached] or [Video attached].'
          },
          {
            label: 'Twitter / X & Instagram Post Format',
            format: 'Author, A. B. [Handle with @]. (Year, Month DD). Title [Tweet]. Platform. URL',
            examples: [
              { citation: 'APA Databases [@APA_Databases]. (2019, September 5). Help students avoid plagiarism and researchers navigate the publication process. More details available in the 7th edition @APA_Style table [Tweet]. Twitter. https://twitter.com/APA_Databases/status/1169644365452578823' }
            ]
          }
        ]
      },
      {
        id: '3-5',
        tabNum: '3.5',
        title: 'Downloadable Media (Podcasts)',
        intro: 'Guidelines for referencing podcasts, downloadable audio files, and radio broadcasts.',
        inText: {
          directQuote: '“The students must use the library’s reference guides” (Anderson, para. 1).',
          paraphrase: 'Anderson (2019) recommended the library’s reference guides.'
        },
        formats: [
          {
            label: 'Audio Broadcast / Podcast',
            format: 'Name, A. B. (Role). (Year, Month DD). Title [Format]. Name of broadcasting organisation. URL',
            examples: [
              { citation: 'Funnell, A. (Reporter). (2019, November 3). Controlled environmental agriculture on future tense [Radio file]. ABC radio. Podcast retrieved from https://radio.abc.net.au/programitem/pewQ1rRJbL' }
            ]
          },
          {
            label: 'Video Podcast',
            format: 'Name, A. B. (Role). (Year, Month DD). Title [Format]. Name of broadcasting organisation. URL',
            examples: [
              { citation: 'Whiting, N. (Reporter). (2019, October 13). Street artists of Port Moresby on Sunday Extra RN [Video file]. ABC radio. Podcast retrieved from https://radio.abc.net.au/programitem/pgrVaz52y7' }
            ],
            note: 'The stated role can be Reporter, Speaker, Host, Writer, or Producer.'
          }
        ]
      },
      {
        id: '3-6',
        tabNum: '3.6',
        title: 'Streaming Media (YouTube / Video)',
        intro: 'Rules for citing streaming video platforms such as YouTube, Vimeo, TED, and Netflix.',
        refFormat: 'Author, A. A. (Year, Month DD). Title [Format]. Platform. URL',
        examples: [
          {
            label: 'YouTube Example 1',
            citation: 'WIRED. (2019, December 18). Meet one of the best drone pilots [Video]. YouTube. https://youtu.be/eerfE-ov98E'
          },
          {
            label: 'YouTube Example 2',
            citation: 'Taylor, D. (2017, May 31). APA Formatting for PowerPoint: How to Apply APA Style to PowerPoint Presentations [Video]. YouTube. https://www.youtube.com/watch?v=xUDafR7TGZY'
          }
        ],
        note: 'Treat the account that uploaded the video as author. Verify that the uploading channel is the original creator before referencing.'
      }
    ]
  },
  {
    id: 'articles',
    num: '4',
    title: 'Articles',
    shortTitle: 'Articles',
    tabs: [
      {
        id: '4-1',
        tabNum: '4.1',
        title: 'Journal Articles',
        intro: 'Peer-reviewed academic journal articles are the bedrock of scholarly research.',
        inText: {
          directQuote: '“Many large organisations adjusted their routine work after the Global Financial Crisis” (Smith, 2019, p. 1).\n— or —\nSmith (2019, p. 1) found that “many large organisations adjusted their routine work after the Global Financial Crisis”.',
          paraphrase: 'The Global Financial Crisis influenced organisations’ routine work (Smith, 2019).\n— or —\nSmith (2019) found that the Global Financial Crisis influenced organisations’ routine work.'
        },
        formats: [
          {
            label: 'Format (Print)',
            format: 'Author 1, A. B., & Author 2, C. D. (Year Published). Title of the article. Title of Journal, Volume(Issue), Pages.',
            examples: [
              { citation: 'Moser, D. V., & Martin, P. R. (2012). A broader perspective on corporate social responsibility research in accounting. The Accounting Review, 87(3), 797-806.' }
            ]
          },
          {
            label: 'Format with DOI (Online)',
            format: 'Author 1, A. B., Author 2, C. D., & Author 3, E. (Year Published). Title of the article. Title of Journal, Volume(Issue), Pages. https://doi.org/xxxxx',
            examples: [
              { citation: 'Moser, D. V., & Martin, P. R. (2012). A broader perspective on corporate social responsibility research in accounting. The Accounting Review, 87(3), 797–806. https://doi.org/10.2308/accr-10257' }
            ]
          },
          {
            label: 'Format without DOI (Online)',
            format: 'Author 1, A. B., Author 2, C. D., & Author 3, E. (Year Published). Title of the article. Title of Journal, Volume(Issue), Pages. URL',
            examples: [
              { citation: 'Ismail, A., Rose, R., Uli, J., & Abdullah, H. (2012). The relationship between organisational resources, capabilities, systems and competitive advantage. Asian Academy of Management Journal, 17(1), 151–173. http://web.usm.my/aamj/default.html' }
            ],
            note: 'Always provide a DOI when available. If unavailable, provide the direct journal homepage URL. Italicise the journal name and volume number.'
          }
        ]
      },
      {
        id: '4-2',
        tabNum: '4.2',
        title: 'Magazine Articles',
        intro: 'Guidelines for citing articles in printed and digital commercial magazines.',
        inText: {
          directQuote: 'The Guardian Weekly (2020, p. 3) reported that “Nicole Kidman and the American country music star Keith Urban also pledged A$500,000 to the Rural Fire Services”.',
          paraphrase: 'Nicole Kidman and her husband, Keith Urban, donated A$500K to the Rural Fire Services (The Guardian Weekly, 2020).'
        },
        formats: [
          {
            label: 'Format (Print)',
            format: 'Author 1, A. B., & Author 2, C. D. (Year, Month DD). Title of the article. Title of the Magazine, Volume(Issue), Pages.',
            examples: [
              { citation: 'Schaefer, N. K., & Shapiro, B. (2019, September 6). New middle chapter in the story of human evolution. Science, 365(6457), 981–982.' }
            ]
          },
          {
            label: 'Format with DOI (Online)',
            format: 'Author 1, A. B., & Author 2, C. D. (Year, Month DD). Title of the article. Title of the Magazine, Volume(Issue), Pages. https://doi.org/xxxxx',
            examples: [
              { citation: 'Schaefer, N. K., & Shapiro, B. (2019, September 6). New middle chapter in the story of human evolution. Science, 365(6457), 981–982. https://doi.org/10.1126/science.aay3550' }
            ]
          },
          {
            label: 'Format with Non-Periodicals (Online)',
            format: 'Author, A. B. (Year, Month DD). Title of the article, Title of the Magazine. Retrieved from URL',
            examples: [
              { citation: 'Sanneh, K. (2019, December 16). The Safdie brothers’ full-immersion filmmaking. The New Yorker. https://www.newyorker.com/magazine/2019/12/16/the-safdie-brothers-full-immersion-filmmaking' }
            ],
            note: 'When online magazines omit volume, issue, or page numbers, omit those elements from the citation.'
          }
        ]
      },
      {
        id: '4-3',
        tabNum: '4.3',
        title: 'Newspaper Articles',
        intro: 'Covers physical daily/weekly newspapers as well as online newspaper portals.',
        inText: {
          directQuote: '“A scholarship awarded to eight USC Moreton Bay students has been called “momentous” by a North Lakes recipient” (Pine Rivers Press, 2020, p. 2).',
          paraphrase: 'Pine Rivers Press launched new-look newspapers which are more compact size than its predecessor (Powell, 2020).'
        },
        formats: [
          {
            label: 'Format (Print)',
            format: 'Author, A. B. (Year, Month DD). Title of the article. Title of Newspaper, page number.',
            examples: [
              { citation: 'Macleod, A. P. (2020, February 13). Gardening neighbours: Artists explore initiative. Pine Rivers Press, 4.' }
            ]
          },
          {
            label: 'Format (Online)',
            format: 'Author, A. B. (Year, Month DD). Title of the article. Title of Newspaper. URL',
            examples: [
              { citation: 'Baum, M. (2019, October 24). School catchment needs to drain swamp. Pine Rivers Press. http://quest.smedia.com.au/pine-rivers-press/' }
            ],
            note: 'Use p. for single pages and pp. for multi-page articles. Use the newspaper homepage URL rather than deep unstable session links when citing online news outlets.'
          }
        ]
      },
      {
        id: '4-4',
        tabNum: '4.4',
        title: 'Conference Papers',
        intro: 'Formats for conference proceedings published in books, online proceedings, and unpublished presentations.',
        formats: [
          {
            label: 'Published Conference Proceedings (in Print)',
            format: 'Author, A. A., & Author, A. B. (Year). Title of paper. In Editor (Ed.), Title of Conference (pp. Page numbers). Location: Publisher.',
            examples: [
              { citation: 'Hayes, R., & Murray, I. (2004). Consumers and Product Prices. In P. D. Garcia, 7th Annual Conference on Business Management: Industry Trends (pp. 7-10). Detroit, MI: Craig.' }
            ]
          },
          {
            label: 'Published Conference Proceedings (Online)',
            format: 'Author, A. A. (Year, Month). Title of paper. Paper presented at Title of Conference, Location. https://doi.org/xxxxx or URL',
            examples: [
              { citation: 'Blakey, N., Guinea, S., & Saghafi, F. (2017, June). Transforming undergraduate nursing curriculum by aligning models of clinical reasoning through simulation. Paper presented at the Research and Development Society of Australasia. http://www.herdsa.org.au/research-and-development-higher-education-vol-40-25' }
            ]
          },
          {
            label: 'Unpublished Conference Paper',
            format: 'Presenter, A. B. (Year, Month). Title of paper or poster. Paper presented at Title of Conference/Organisation, Location.',
            examples: [
              { citation: 'Pentland, B. T., Recker, J., & Wyner, G. (2016, 11-14 December). Conceptualizing and measuring interdependence between organizational routines. Paper presented at the International Conference on Information Systems (ICIS 2016), Dublin, Ireland.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'reports',
    num: '5',
    title: 'Documents and Reports',
    shortTitle: 'Documents & Reports',
    tabs: [
      {
        id: '5-1',
        tabNum: '5.1',
        title: 'Government Organisations',
        intro: 'Official government publications, parliamentary inquiries, white papers, and commission reports.',
        inText: {
          directQuote: '“Many large organisations changed their routine work after the Global Financial Crisis” (Chan, 2019, p. 22).',
          paraphrase: 'Chan (2019) found that the Global Financial Crisis impacted on large organisations’ routine work.'
        },
        formats: [
          {
            label: 'Report with Personal Authors',
            format: 'Author, A. A. (Year, Month). Title of publication (Report number, if available). Publisher. URL',
            examples: [
              { citation: 'Hockings, M., Leverington, A., Trinder, C., & Polglaze, J. (2014). Independent assessment of management effectiveness for the Great Barrier Reef Outlook Report 2014. Great Barrier Reef Marine Park Authority. http://hdl.handle.net/11017/2857' }
            ],
            note: 'When an official handle or permanent document identifier is provided, prefer it over dynamic web URLs.'
          },
          {
            label: 'Report with Series / Publication Number',
            format: 'Organisation Name. (Year). Title of publication (Publication No. xxx). Department Name. URL',
            examples: [
              { citation: 'National Institute of Nursing Research. (2015). A family’s perspective: Pediatric palliative care stories (NIH Publication No. 15-NR-8018). U.S. Department of Health and Human Services, National Institutes of Health. https://www.ninr.nih.gov/sites/files/docs/NINR_508c_FamilyStories_0.pdf' }
            ]
          },
          {
            label: 'Parliamentary Inquiry Report',
            format: 'Parliament Name. (Year). Title of inquiry. Publisher. URL',
            examples: [
              { citation: 'Parliament of the Commonwealth of Australia. (2018). Internet competition inquiry: Inquiry into impacts on local businesses in Australia from global internet-based competition. Commonwealth of Australia. https://parlinfo.aph.gov.au/parlInfo/download/committees/reportrep/024149/toc_pdf/InternetCompetitionInquiry.pdf' }
            ]
          }
        ]
      },
      {
        id: '5-2',
        tabNum: '5.2',
        title: 'Non-Government Organisations (NGOs)',
        intro: 'Reports, dashboards, policy whitepapers, and briefings from corporate entities and global NGOs.',
        inText: {
          directQuote: '“Commonwealth Bank reduces interest rates for home loan customers” (Commonwealth Bank of Australia, 2020, para. 1).',
          paraphrase: 'Commonwealth Bank supports home loan customers by reducing interest rates (Commonwealth Bank of Australia, 2020).'
        },
        formats: [
          {
            label: 'Report with Named Authors',
            format: 'Author, A. B. (Year, Month). Title of report. Publisher. URL',
            examples: [
              { citation: 'Chui, M., Manyika, J., & Miremadi, M. (2020, February). Notes from the AI frontier: Applications and value of deep learning. McKinsey & Company. https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights/notes-from-the-ai-frontier-applications-and-value-of-deep-learning' }
            ]
          },
          {
            label: 'Report / Dashboard with Corporate Author',
            format: 'Organisation Name. (Year). Title of report. URL',
            examples: [
              { citation: 'World Health Organization. (2020). COVID-19 dashboard. https://covid19.who.int/' },
              { citation: 'International Energy Agency. (2020). Global energy review 2020. https://www.iea.org/reports/global-energy-review-2020' }
            ],
            note: 'Italicise the title of the document when the document is standalone and not part of an overarching web page.'
          }
        ]
      }
    ]
  },
  {
    id: 'data',
    num: '6',
    title: 'Data, Figures and Tables',
    shortTitle: 'Data & Figures',
    tabs: [
      {
        id: '6-1',
        tabNum: '6.1',
        title: 'Figures & Charts',
        intro: 'Figures include graphs, charts, diagrams, and maps. How you reference a figure differs depending on whether you reprint an existing figure directly or construct a new figure from multiple data sources.',
        inText: {
          textMention: 'As shown in Figure 1, the different degrees of virtuality create unique patterns.\n— or —\nThe different degrees of virtuality create unique patterns (See Figure 1).',
          note: 'Mention the figure in your body text immediately before the figure appears.'
        },
        subsections: [
          {
            title: 'Reprinting a Single Figure Directly',
            format: 'Figure #. Caption (Title of figure). Reprinted from Title of work, by Author, Year, URL. Copyright Year by Owner of work.',
            imageUrl: 'https://cdn.library.aibtglobal.edu.au/2025/06/86abeea5-picture1.png',
            imageAlt: 'Figure 1 Service Virtuality Graph',
            caption: 'Figure 1. Graph of the Service virtuality and impacts on service separation. Reprinted from Exploring service innovation capability in virtual servicescapes: An Australian higher education case, by Emiko Nozu, 2018, https://eprints.qut.edu.au/120278/1/Emiko_Nozu_Thesis.pdf. Copyright 2018 by Emiko Nozu.',
            refEntry: 'Nozu, E. (2018). Exploring service innovation capability in virtual servicescapes: An Australian higher education case.'
          },
          {
            title: 'Compiling a New Figure from Multiple Data Sources',
            format: 'Figure #. Data for [Country/Topic] from Author (Year), for [Country/Topic] from Author (Year)…',
            imageUrl: 'https://cdn.library.aibtglobal.edu.au/2025/06/8e517fec-picture2.png',
            imageAlt: 'Figure 2 Employment per major sector graph',
            caption: 'Figure 2. Employment per major sector. Data for the UK from UK Department for Business Innovation & Skills (2012), for United States from U.S. Bureau of Labour Statistics (2013), for Australia from Australian Department of Education Employment and Workplace Relations (2013), and for Canada from Statistics Canada (2015).',
            refEntries: [
              'UK Department for Business Innovation & Skills. (2012). Industrial strategy: UK sector analysis. https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/34607/12-1140-industrial-strategy-uk-sector-analysis.pdf',
              'U.S. Bureau of Labour Statistics. (2013). Employment by major industry sector. http://www.bls.gov/emp/ep_table_201.htm',
              'Australian Department of Education Employment and Workplace Relations. (2013). Australian jobs 2013. Canberra.',
              'Statistics Canada. (2015). Employment by industry. http://www.statcan.gc.ca/tables-tableaux/sum-som/l01/cst01/econ40-eng.htm'
            ]
          }
        ]
      },
      {
        id: '6-2',
        tabNum: '6.2',
        title: 'Tables',
        intro: 'If you are reprinting a table, altering someone else’s table, or creating a new table from published data, you must provide a title above the table, an attribution note underneath, and a complete entry in your reference list.',
        table1: {
          number: 'Table 1',
          title: 'Four types of service features and marketing solutions',
          headers: ['Features', 'Marketing Problems', 'Strategies to Solve Problems'],
          rows: [
            ['Intangibility', '• Service cannot be stored\n• Prices are difficult to set', '• Stress tangible cues\n• Create a strong organisational image'],
            ['Inseparability', '• Consumer involved in the production', '• Emphasise the selection and training of public contact personnel'],
            ['Heterogeneity', '• Standardisation and quality control difficult to achieve', '• Industrialise service\n• Customise service'],
            ['Perishability', '• Services cannot be inventoried', '• Use strategies to cope with fluctuating demand']
          ],
          note: 'Adapted from “Problems and strategies in services marketing,” by V. A. Zeithaml, A. Parasuraman, & L. L. Berry, 1985, Journal of Marketing (pre-1986), 49, p. 35.',
          refEntry: 'Zeithaml, V. A., Parasuraman, A., & Berry, L. L. (1985). Problems and strategies in services marketing. Journal of Marketing (pre-1986), 49(2), 33-46.'
        },
        table2: {
          number: 'Table 2',
          title: 'Employment per major sector in Anglo-Saxon countries',
          headers: ['Sector', 'UK (2011)', 'US (2012)', 'Australia (2012)', 'Canada (2012)'],
          rows: [
            ['Primary', '1.3%', '1.5%', '3.0%', '2.0%'],
            ['Production', '16.5%', '12.0%', '11.0%', '20.0%'],
            ['Services', '83.0%', '81.0%', '86.0%', '78.0%']
          ],
          note: 'Data for the number of employment per sector for the UK from UK Department for Business Innovation & Skills (2012), for United States from U.S. Bureau of Labour Statistics (2013), for Australia from Australian Department of Education Employment and Workplace Relations (2013), and for Canada from Statistics Canada (2015).'
        }
      },
      {
        id: '6-3',
        tabNum: '6.3',
        title: 'Images & Photos',
        intro: 'All photographs, logos, illustrations, and artworks must cite the original source. Students may use informal assignment formatting, whereas published theses require formal copyright attributions.',
        items: [
          {
            title: 'Image from Discovery Library Resources (Informal Student Format)',
            format: 'Figure #. Title of an image (Discovery Library, Year).',
            imageUrl: 'https://cdn.library.aibtglobal.edu.au/2025/06/61019e89-picture3.png',
            imageAlt: 'Discovery Library Logo Figure 1',
            caption: 'Figure 1. Discovery Library logo (Discovery Library, 2025).',
            refEntry: 'Discovery Library. (2025). Discovery Library logo [Image]. https://discoverylibrary.com.au/'
          },
          {
            title: 'Images from Search Engines / Web (Informal Student Format)',
            format: 'Figure #. Title of image (or description), by full name of creator, date of retrieval, URL',
            imageUrl: 'https://cdn.library.aibtglobal.edu.au/2025/06/f54b48d3-picture4.png',
            imageAlt: 'Photograph of Kallangur State School Figure 2',
            caption: 'Figure 2. Photograph of Kallangur State School, by Emiko Nozu, March 1, 2020, https://cdn.australia247.info/assets/uploads/be871abfcd69d993f089c826392e93ff_-queensland-moreton-bay-regional-kallangur-kallangur-state-schoolhtml.jpg',
            refEntry: 'Nozu, E. (2018). Photograph of Kallangur State School [Image]. https://cdn.australia247.info/assets/uploads/be871abfcd69d993f089c826392e93ff_-queensland-moreton-bay-regional-kallangur-kallangur-state-schoolhtml.jpg'
          },
          {
            title: 'Formal Image Citation (Publications & Theses)',
            format: 'Figure #. Title of the image. Reprinted from Title of work, by Author, date, Copyright Date by Copyright Holder.',
            imageUrl: 'https://cdn.library.aibtglobal.edu.au/2025/06/96312df3-picture5.png',
            imageAlt: 'Cover of APA Style manual Figure 3',
            caption: 'Figure 3. Cover of the APA Style manual. Reprinted from Concise guide to APA style, seventh edition, by American Psychological Association, February 24 2020, https://apastyle.apa.org/products/concise-guide Copyright 2009 by the American Psychological Association.',
            refEntry: 'American Psychological Association. (2019). Cover of the APA Style manual [Image]. https://apastyle.apa.org/products/concise-guide'
          }
        ]
      },
      {
        id: '6-4',
        tabNum: '6.4',
        title: 'Australian Bureau of Statistics (ABS)',
        intro: 'Guidelines tailored for statistical tables, time series spreadsheets, and Census profiles from the Australian Bureau of Statistics.',
        inText: {
          directQuote: '“Bushfires resulted in disruption to ABS data collection operations in some regions in New South Wales and Victoria during January 2020” (Australian Bureau of Statistics, 2020, para. 4).',
          paraphrase: 'The bushfires in Australia created some disruptions for ABS data collections in some regions in 2020 (Australian Bureau of Statistics, 2020).'
        },
        formats: [
          {
            label: 'General ABS Website',
            format: 'Australian Bureau of Statistics. (Year). Title, followed by the date of viewing in the form: viewed dd month yyyy, URL',
            example: 'Australian Bureau of Statistics. (2019). About the Australian Bureau of Statistics. Viewed 28 February 2020, https://www.abs.gov.au/about?OpenDocument&ref=topBar'
          },
          {
            label: 'Time Series Spreadsheets',
            format: 'Australian Bureau of Statistics. (Year). Title, ‘Table/Figure #. Title of Table/Figure’, format (e.g. time series spreadsheet), catalogue #, viewed dd month yyyy, URL',
            example: 'Australian Bureau of Statistics. (2009). Labour force, Australia, ‘Table 01. Labour force status by sex – seasonally adjusted’, time series spreadsheet, cat. no. 6202.0.55.001, viewed 28 February 2020, https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/6202.0.55.001Jan%202009?OpenDocument'
          },
          {
            label: 'Census Material on the Website',
            format: 'Australian Bureau of Statistics. (Year). ‘Title’, viewed dd month yyyy, URL',
            example: 'Australian Bureau of Statistics. (2009). ‘Great Brisbane (Statistical Local Area), People – demographics & education’, viewed 28 February 2020, https://quickstats.censusdata.abs.gov.au/census_services/getproduct/census/2016/quickstat/3GBRI?opendocument'
          }
        ]
      }
    ]
  },
  {
    id: 'authors',
    num: '7',
    title: 'Number of Authors',
    shortTitle: 'Number of Authors',
    tabs: [
      {
        id: '7-1',
        tabNum: '7.1',
        title: 'How Many Authors Do You Have?',
        intro: 'APA 7th has strict rules for how author names are rendered depending on the total count of co-authors.',
        table: [
          {
            count: '1–2 authors',
            inText: 'Narrative: Verma and Shaik (2023) noted that students who read bilingual books performed better in vocabulary tests.\nParenthetical: Students who read bilingual books may perform better in vocabulary tests (Verma & Shaik, 2023).',
            refList: 'Verma, N., & Shaik, T. (2023). Designing an artificial intelligence tool to understand student engagement based on teacher’s behaviours and movements in video conferencing. https://doi.org/10.1016/j.caeai.2023.100187',
            desc: 'Always mention all author names every time you cite the work.'
          },
          {
            count: '3–20 authors',
            inText: 'Narrative: Boers et al.’s (2017) research into the use of pictures in glosses found they may decrease attention given to words.\nParenthetical: Using pictures to illustrate glosses may decrease attention given to words (Boers et al., 2017).',
            refList: 'Boers, F., Warren, P., He, L., & Deconinck, J. (2017). Does adding pictures to glosses enhance vocabulary uptake from reading? System, 66, 113-129. https://doi.org/10.1016/j.system.2017.03.017\n\nFor 21+ authors: list first 19, insert an ellipsis (…), and then the final author.\nTobler, R., Rohrlach, A., Soubrier, J., … Cooper, A. (2017). Aboriginal mitogenomes reveal 50,000 years of regionalism in Australia. Nature, 544(7649), 180-184.',
            desc: 'In-text: cite only the first author’s surname followed immediately by “et al.”\nReference List: list all authors up to 20.'
          },
          {
            count: 'No author or anonymous',
            inText: 'Narrative: According to Merriam-Webster’s Collegiate Dictionary (2023), the term originated…\nParenthetical: (Merriam-Webster’s Collegiate Dictionary, 2023)',
            refList: 'Merriam-Webster’s collegiate dictionary (11th ed.). (2023). Merriam-Webster, Inc.',
            desc: 'Move the title to the author position in the reference list. In body text, place the title in quotation marks or italics.'
          }
        ]
      },
      {
        id: '7-2',
        tabNum: '7.2',
        title: 'Format of Authors',
        intro: 'Detailed styling rules for initials, hyphenations, multi-part surnames, cultural particles, and suffixes.',
        rules: [
          'Use only initials for authors’ first or given names in the reference list.',
          'Hyphenated first names: format as initial, period, hyphen, second initial (e.g. Jean-Luc Picard becomes Picard, J.-L.).',
          'Hyphenated surnames: keep both names and the hyphen in both the reference list and in-text citation (e.g. Jones-Smith, 2015).',
          'Un-hyphenated multi-part surnames: separate with a space in both the reference list and in-text citation (e.g. Arce Arias, A., 2017).',
          'Particles (van, der, den, de, la, von): include the particle before the surname (e.g. van der Woodsen, 2021; Del Castillo, 2017). Respect the author’s capitalization.',
          'Generational suffixes (Jr., Sr., III): include the suffix after the second initial in the reference list (e.g. Jones, H. W., Jr., & Jones, H. W., Sr., 1941). Never include suffixes in in-text citations.'
        ]
      },
      {
        id: '7-3',
        tabNum: '7.3',
        title: 'Order of Authors',
        intro: 'Rules for ordering names within an individual reference and organizing the overall reference list.',
        rules: [
          'Do not alter the order of co-authors listed on a published work; retain the original author sequence.',
          'Your overall reference list must be alphabetized by the surname of the first author.',
          'Multiple works cited together in parentheses: arrange in the same order they appear in the reference list (alphabetical by first author, then chronological from oldest to newest for the same author), separated by semicolons (e.g., Corbin, 2019; James & Waterson, 2019; Smith et al., 2019).',
          'Same author and same publication year: append lowercase letters in alphabetical order (e.g., Queensland Health, 2020a, 2020b).',
          'In-text initials: use surnames only in-text unless two first authors share the same surname and publication year (e.g., K. Smith, 2020; N. Smith, 2020).'
        ]
      }
    ]
  },
  {
    id: 'lists',
    num: '8',
    title: 'Bulleted, Numbered, and Lettered Lists',
    shortTitle: 'Lists & Formatting',
    tabs: [
      {
        id: '8-1',
        tabNum: '8.1',
        title: 'Lettered Lists',
        intro: 'Used for listing series of items within the continuous flow of a single paragraph.',
        rules: [
          'Separate each item in the sentence with lowercase letters enclosed in parentheses: (a), (b), (c).',
          'Maintain parallel grammatical structure for each item.',
          'Use commas (or semicolons if elements contain internal commas) between items.'
        ],
        example: 'Athletes who suffer from knee injuries can facilitate the recovery process by (a) attending physical therapy sessions regularly, (b) refraining from playing sports until they completely heal, and (c) taking necessary medication.'
      },
      {
        id: '8-2',
        tabNum: '8.2',
        title: 'Numbered Lists',
        intro: 'Used when items represent a sequential order, chronology, or step-by-step process. APA requires complete grammatical sentences for numbered items.',
        example: 'We considered the following questions:\n1. How can athletes who suffer from knee injuries facilitate the recovery process?\n2. If athletes attend physical therapy sessions regularly, what impact does this have on the recovery process?\n3. If an athlete refuses to refrain from playing sports until they completely heal, what impact does this have on the recovery process?'
      },
      {
        id: '8-3',
        tabNum: '8.3',
        title: 'Bulleted Lists',
        intro: 'Bulleted lists avoid implying chronological sequence or priority. They can consist of phrases or complete sentences.',
        examples: [
          {
            type: 'Example 1: Paraphrased List (Page Number Omitted)',
            text: 'Verma (2023) suggests four reasons that actors often changed their routines:\n• the outcome of actions created a new problem;\n• the outcome of actions created new action opportunities;\n• intended outcomes are achieved, but actors see improvements; and\n• the outcomes of actions did not create expected results.',
            note: 'Since the list represents paraphrased ideas, individual page numbers are omitted.'
          },
          {
            type: 'Example 2: Block Quote List (All Items Direct Quotes)',
            text: 'In his routines study, Verma highlights the three types of routine work. These routines, she suggests:\n• flexing work means actors adapting existing interdependent actions in a routine that all participants are familiar with;\n• stretching work means actors adapting actions to stretch the application of an existing routine with other participants [within an organisation] who are unfamiliar with the routine; and\n• inventing work refers to actors building a new emerging action pattern without drawing on a particular existing routine (Verma, 2023, p. 850).',
            note: 'Block quote format is used for verbatim lists. Individual quotation marks are unnecessary. The citation with page number is placed after the final list item.'
          },
          {
            type: 'Example 3: Direct Quote – All Items with Lead-In Citation',
            text: 'Verma (2023) suggests four reasons that actors often changed their routines:\n• the outcome of actions created a new problem;\n• the outcome of actions created new action opportunities;\n• intended outcomes are achieved, but actors see improvements; and\n• actions did not create intended outcomes (p. 11).',
            note: 'When the author and year are cited in the introductory sentence, place only the parenthetical page number at the end of the final bullet.'
          },
          {
            type: 'Example 4: Direct Quote on a Single Bullet Item',
            text: 'Verma (2023) suggests four reasons that actors often changed their routines:\n• the outcome of actions created a new problem.\n• the outcome of actions created new action opportunities.\n• “intended outcomes are achieved, but actors see improvements” (Verma 2023, p. 25).\n• actions did not create desired/intended outcomes.',
            note: 'When only one item is quoted verbatim among paraphrased items, enclose that item in quotation marks and provide the citation directly on that item.'
          }
        ]
      }
    ]
  }
];
