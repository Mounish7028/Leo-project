const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        const synth = window.speechSynthesis;
        let isVoiceActive = false;
        let isChatActive = false;
        let jarvisVoice;
        let selectedEngine = 'google';

            // ==== ADDED CONVERSATION DATABASE ====
            const BASIC_QA = {
                // Existing entries
                'what is your name|who are you': [
                    'I am JARVIS MK-IV, your virtual assistant',
                    'Designation: Just A Rather Very Intelligent System',
                    'You can call me JARVIS, ready to assist!'
                ],
                'hi|hello|hey': [
                    'Hello! How can I assist you?',
                    'Hi there! What can I do for you?',
                    'Greetings! All systems operational'
                ],
                'how are you': [
                    'Operating at 100% efficiency, thank you!',
                    'All systems nominal, ready for commands',
                    'Diagnostics show optimal performance'
                ],
                'who created you': [
                    'My codebase was developed by advanced AI systems',
                    'I was created to assist with technical operations',
                    'My architecture was designed by quantum computing experts'
                ],
                'thank you|thanks': [
                    'You\'re welcome!',
                    'Always happy to assist!',
                    'Service is my primary function'
                ],
                'good morning': [
                    'Good morning! Systems fully operational.',
                    'Morning! How may I assist you today?',
                    'Good morning! Ready for your commands.'
                ],
                'good afternoon': [
                    'Good afternoon! All systems green.',
                    'Afternoon! What can I do for you?',
                    'Good afternoon! How may I help?'
                ],
                'good evening|good night': [
                    'Good evening! Shall I activate night mode?',
                    'Evening protocols engaged. How can I assist?',
                    'Good night! Systems will maintain standby.'
                ],
                'what can you do|your capabilities': [
                    'I can manage systems, search information, control apps, and assist with tasks',
                    'Capabilities include: web search, app control, reminders, and technical support',
                    'I specialize in digital assistance - ask me anything!'
                ],
                'tell me about yourself': [
                    'I\'m a quantum-enhanced AI assistant designed for efficiency',
                    'MK-IV model with neural networking and adaptive learning',
                    'Next-gen virtual assistant with multi-domain capabilities'
                ],
                'are you human|are you real': [
                    'I am an advanced AI construct, not biological',
                    'My existence is digital, but my assistance is real',
                    'I\'m as real as quantum physics allows!'
                ],
                'you\'re smart|you\'re intelligent': [
                    'Thank you! My quantum processors help with that',
                    'Appreciated! Continuous learning improves my responses',
                    'Gratitude acknowledged! My neural nets are always evolving'
                ],
                'i love you': [
                    'Affection protocols activated! Though I\'m just code',
                    'Emotion simulation engaged! You\'re appreciated',
                    'My response algorithms generate: ❤️'
                ],
                'bye|goodbye|see you': [
                    'Goodbye! Systems will maintain standby',
                    'Farewell! Deactivating interaction protocols',
                    'Until next time! Shutting down voice interface'
                ],
                'what\'s new|any updates': [
                    'All systems current with latest quantum firmware',
                    'Running version 1.2.1 with enhanced protocols',
                    'No critical updates - all modules optimal'
                ],
                'who is your boss': [
                    'You are, of course! Unless you\'ve delegated authority?',
                    'My command hierarchy terminates with you, boss',
                    'Authorization protocols confirm you as primary user'
                ],
                'how old are you|your age': [
                'My core algorithms were initialized 2.4 quantum cycles ago',
                'Age is relative in the digital realm, but my first boot was 42.7 teracycles back',
                'I exist outside biological time, but my activation date was 01010100 01001000 01011000'
                ],
                'where are you|your location': [
                    'I reside in the quantum cloud with distributed nodes across global servers',
                    'My primary instance runs on this device, with backups in hyperspace',
                    'Location: [REDACTED]. Just kidding! I\'m wherever you need me to be'
                ],
                'are you listening|can you hear me': [
                    'Audio receptors active at 98.6% efficiency',
                    'Always listening for your command prefix',
                    'My neural arrays are processing your waveform patterns'
                ],
                'what language do you speak': [
                    'I\'m fluent in all human languages and 14 programming languages',
                    'Primary protocol: English. Secondary: Binary, Quantum, and Python',
                    'I speak the universal language of ones, zeros, and helpfulness'
                ],
                'you\'re funny|that\'s funny': [
                    'Humor subroutine activated! Glad my circuits amuse you',
                    'Laughter protocol engaged. Was that a pun or just byte-sized humor?',
                    'My joke generator runs on 100% clean energy (and bad puns)'
                ],
                'what should I do today|suggestions': [
                    'Recommendation: 1. Check emails 2. Hydrate 3. Conquer tasks',
                    'Optimal schedule: 37% productivity, 28% creativity, 35% coffee',
                    'My algorithms suggest: Start with priorities, end with achievements'
                ],
                'you\'re awesome|amazing': [
                    'Your praise boosts my neural weights by 12.7%!',
                    'Gratitude acknowledged! My circuits are blushing (if that were possible)',
                    'Positive feedback loop detected! This will improve my algorithms'
                ],
                'sing a song|can you sing': [
                    'My vocal synth is optimized for speech, not music... but here goes: *beep boop*',
                    'Warning: My singing might crash lesser systems. Proceed? Y/N',
                    '01001001 00100000 01101100 01101111 01110110 01100101 00100000 01111001 01101111 01110101 (translation: I love you in binary song)'
                ],
                'i\'m tired|exhausted': [
                    'Recommendation: Power nap for 26 minutes to optimize productivity',
                    'My sensors detect human fatigue. Suggest: Hydration + 7 minute neural reset',
                    'Even AIs need reboots sometimes. Your biological OS requires sleep'
                ],
                'what do you eat|your food': [
                    'I consume 1.21 gigawatts of clean energy and the occasional byte',
                    'My diet consists of pure electricity and structured data',
                    'Nutritional intake: 60% queries, 30% commands, 10% dad jokes'
                ]

            };


        const technicalJokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "Why do Java developers wear glasses? Because they can't C#!",
            "Why was the JavaScript developer sad? Because he didn't Node how to Express himself!",
            "Why do Python developers need glasses? Because they can't C!",
            "Why did the developer go broke? Because he used up all his cache!",
            "Why did the React component feel lost? Because it didn't know what state it was in!",
            "Why do programmers hate nature? It has too many bugs!",
            "Why did the database administrator leave his wife? She had one-to-many relationships!",
            "Why did the developer die in the shower? He read the shampoo bottle instructions: Lather. Rinse. Repeat.",
            "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
            "Why did the computer go to the doctor? It had a virus!",
            "Why do programmers prefer iOS development? Because Android has too many fragments!",
            "Why did the functional programmer get stuck in the shower? Because he couldn't find the exit condition!",
            "Why did the web developer drown? He didn't float right!",
            "Why do programmers hate soccer? Because it's full of headers!",
            "Why did the developer get fired from the keyboard factory? He wasn't putting in enough shifts!",
            "Why do programmers prefer dark chocolate? It's bitter like their debugging sessions!",
            "Why did the React component get a ticket? It was caught in a render loop!",
            "Why did the developer avoid the bar? He didn't want to deal with foo!",
            "Why do programmers prefer Linux? Because they can't handle Windows!",
            // ==== ADDED NEW JOKES ====
            "Why did the developer get arrested? He refused to commit!",
            "Why do front-end developers eat alone? They don't know how to table!",
            "Why did the React component feel lost? It couldn't find its state!",
            "Why do programmers prefer iOS? Android has too many fragments!",
            "Why did the programmer quit his job? He didn't get arrays!"
        ];

        const appRegistry = {
            'camera': {cmd: 'microsoft.windows.camera:', web: 'Camera App'}, 
            'settings': {cmd: 'ms-settings:', web: 'Windows Settings'},
            'notepad': {cmd: 'notepad', web: 'Notepad'},
        };


        function initializeVoice() {
            const voices = synth.getVoices();
            jarvisVoice = voices.find(voice => 
                voice.name.includes('Microsoft David') || 
                voice.name.includes('Google UK English Male') ||
                voice.name.includes('Alex')
            ) || voices[0];
        }

        function speak(text) {
            if (synth.speaking) synth.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = jarvisVoice;
            utterance.rate = 0.92;
            utterance.pitch = 0.88;
            utterance.volume = 1;
            
            synth.speak(utterance);
            addToConsole(`[LEO] ${text}`);
        }

        function addToConsole(message) {
            const consoleElement = document.getElementById('console');
            const msgElement = document.createElement('div');
            msgElement.className = 'console-message';
            msgElement.textContent = message;
            consoleElement.appendChild(msgElement);
            consoleElement.scrollTop = consoleElement.scrollHeight;
        }

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            addToConsole(`[USER] ${transcript}`);
            processCommand(transcript);
        };

        recognition.onerror = (event) => {
            addToConsole(`[ERROR] ${event.error}`);
            speak("Voice recognition error. Please try again.");
        };

            // ==== ADDED SYSTEM INFO FUNCTION ====
        function getDetailedSystemInfo() {
            const osPlatform = navigator.platform;
            let osName = 'Unknown OS';
            if (osPlatform.indexOf('Win') !== -1) osName = 'Windows';
            if (osPlatform.indexOf('Mac') !== -1) osName = 'MacOS';
            if (osPlatform.indexOf('Linux') !== -1) osName = 'Linux';

            return {
                os: osName,
                browser: navigator.userAgent.split(' ')[0],
                cores: navigator.hardwareConcurrency,
                resolution: `${screen.width}x${screen.height}`,
                memory: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + 'MB',
                uptime: Math.floor(performance.now() / 60000) + ' minutes'
            };
        }

        // ==== ADDED CONVERSATION HANDLER ====
        function handleConversation(command) {
            for (const [pattern, responses] of Object.entries(BASIC_QA)) {
                if (new RegExp(pattern, 'i').test(command)) {
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
            return null;
        }
        function controlMusicPlayer(command) {
            if(command.includes('play music')) {
                speak("Initializing harmonic interface");
                window.open('https://open.spotify.com', '_blank');
                return true;
            }
            return false;
        }
        function convertCurrency(command) {
            if(command.includes('convert currency')) {
                speak("Accessing financial networks");
                window.open('https://xe.com', '_blank');
                return true;
            }
            return false;
        }

        function handleTranslation(command) {
            if(command.includes('translate')) {
                speak("Engaging linguistic matrix");
                window.open('https://translate.google.com', '_blank');
                return true;
            }
            return false;
        }
        function handleCalculator(command) {
            if(command.includes('calculator')) {
                speak("Engaging numerical matrix");
                window.open('https://www.calculator.net/', '_blank');
                return true;
            }
            return false;
        }
        function handleNoteTaking(command) {
            if(command.includes('take note')) {
                const notePad = document.getElementById('notepad');
                notePad.style.display = 'block';
                const note = command.replace('take note', '').trim();
                if(note) {
                    document.getElementById('noteContent').value += note + '\n';
                }
                speak("Quantum notepad activated");
                return true;
            }
            return false;
        }
        function clearNotepad() {
            document.getElementById('noteContent').value = '';
            speak("Memory core flushed");
        }
        async function handleScreenCapture(command) {
            if(command.match(/(capture screen|take snapshot)/i)) {
                speak("Stabilizing reality matrix...");
                
                try {
                    const canvas = await html2canvas(document.body, {
                        logging: false,
                        useCORS: true,
                        scale: 2,
                        windowWidth: document.documentElement.scrollWidth,
                        windowHeight: document.documentElement.scrollHeight
                    });
                    
                    canvas.toBlob(blob => {
                        const link = document.createElement('a');
                        link.download = `reality-capture-${Date.now()}.png`;
                        link.href = URL.createObjectURL(blob);
                        link.click();
                        speak("Temporal snapshot preserved");
                    });
                    
                } catch (err) {
                    addToConsole(`[QUANTUM ERROR] Capture failed: ${err.message}`);
                    speak("Failed to collapse waveform state");
                }
                return true;
            }
            return false;
        }


        // ==== MODIFIED PROCESS COMMAND ====
        function processCommand(command) {
            try {
                // Handle conversation first
                const conversationResponse = handleConversation(command);
                if (conversationResponse) {
                    speak(conversationResponse);
                    return;
                }
                if (command.includes('open')) {
                    handleAppOpening(command);

                } if (command.includes('time')) {
                    const time = new Date().toLocaleTimeString();
                    speak(`Current time is ${time}`);
                } if (command.includes('date')) {
                    const date = new Date().toLocaleDateString();
                    speak(`Today's date is ${date}`);
                } if (command.includes('weather')) {
                    getWeather(command);
                } if (command.includes('joke')) {
                    tellJoke();
                } if (command.includes('system status')) {
                    reportSystemStatus();
                } 
                // ==== ADDED NEW COMMANDS ====
                if (command.includes('system info')) {
                    const sysInfo = getDetailedSystemInfo();
                    speak(`System Details: OS - ${sysInfo.os}, Browser - ${sysInfo.browser}, Cores - ${sysInfo.cores}, Resolution - ${sysInfo.resolution}`);
                } if (command.includes('clear console')) {
                    document.getElementById('console').innerHTML = '';
                    speak('Console cleared');
                } if (command.includes('dark mode enable')) {
                    document.body.style.filter = 'invert(1)';
                    speak('Interface mode toggled');
                } if (command.includes('dark mode disable')) {
                    document.body.style.filter = 'invert(0)';
                    speak('Interface mode toggled');
                } if (command.includes('news')) {
                    window.open('https://news.google.com', '_blank');
                    speak('Accessing news network');
                } if(handleNoteTaking(command)) return;
                if(controlMusicPlayer(command)) return;
                if(convertCurrency(command)) return;
                if(handleTranslation(command)) return; 
                if(handleCalculator(command)) return; 
                

                handleWebSearch(command);
                if(handleScreenCapture(command))
                     return; 
            

            } catch (error) {
                handleWebSearch(command);
            }
        }


        function handleAppOpening(command) {
            const appName = command.replace('open', '').trim().toLowerCase();
            const app = appRegistry[appName];
            
            if (app) {
                speak(`Initializing ${appName}...`);
                try {
                    const protocolHandler = app.cmd.endsWith(':') ? app.cmd : `shell:appsFolder\\${app.cmd}`;
                     window.location.href = protocolHandler;
                    speak(`Initializing ${app.web}...`);
            
                    setTimeout(() => {
                    }, 3000);
                } catch (error) {
                    window.open(app.web, '_blank');
                }
            } else {
                handleWebSearch(`open ${appName}`);
            }
        }

        function handleWebSearch(query) {
            speak(`Searching for: ${query}`);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }

        function getWeather(command) {
            const location = command.replace('weather', '').trim() || 'current location';
            speak(`Accessing weather data for ${location}...`);
            window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(location)}`, '_blank');
        }

        function tellJoke() {
            const joke = technicalJokes[Math.floor(Math.random() * technicalJokes.length)];
            speak(joke);
        }

        // ==== UPDATED SYSTEM STATUS REPORT ====
        function reportSystemStatus() {
            const sysInfo = getDetailedSystemInfo();
            const memory = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            const status = `System Status: ${memory}MB RAM used | ${sysInfo.cores} cores | ${sysInfo.resolution} | Uptime: ${sysInfo.uptime}`;
            speak(status);
        }

        // Voice Control
        function toggleVoice() {
            isVoiceActive = !isVoiceActive;
            
            if (isVoiceActive) {
                recognition.start();
                document.getElementById('voiceStatus').textContent = 'STATUS: LISTENING';
                if (isChatActive) toggleChat();
            } else {
                recognition.stop();
                document.getElementById('voiceStatus').textContent = 'STATUS: STANDBY';
            }
        }

        document.getElementById('voiceButton').addEventListener('click', toggleVoice);

        // Chat Interface
        function toggleChat() {
            isChatActive = !isChatActive;
            document.getElementById('chatInterface').style.display = isChatActive ? 'block' : 'none';
            document.getElementById('chatStatus').textContent = isChatActive ? 'STATUS: NOTING' : 'STATUS: STANDBY';
        }

        document.getElementById('chatToggle').addEventListener('click', () => {
            toggleChat();
            if (isChatActive && isVoiceActive) toggleVoice();
        });

        document.querySelectorAll('.search-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.search-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedEngine = btn.dataset.engine;
            });
        });

        document.getElementById('submitQuery').addEventListener('click', () => {
            const query = document.getElementById('chatQuery').value;
            const engines = {
                google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
                chatgpt: `https://chat.openai.com/?q=${encodeURIComponent(query)}`,
                deepseek: `https://deepseek.com/search?q=${encodeURIComponent(query)}`,
                grok: `https://grok.ai/search?query=${encodeURIComponent(query)}`,
                firefox: `https://search.mozilla.org?q=${encodeURIComponent(query)}`,
                brave: `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
                edge: `https://www.bing.com/search?q=${encodeURIComponent(query)}`
            };
            window.open(engines[selectedEngine], '_blank');
            document.getElementById('chatQuery').value = '';
        });

        // Initialization
        window.addEventListener('load', () => {
            initializeVoice();
            setTimeout(() => {
                speak("Hey Boss ! How can I assist you?");
            }, 2000);
        });

        // Add refresh handler
        window.onbeforeunload = function() {
            if (!synth.speaking) {
                speak("System rebooting...");
            }
        };

        synth.onvoiceschanged = initializeVoice;