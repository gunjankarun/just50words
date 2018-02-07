<Screenshots here>

# What is "Just 50 words"
Just 50 words is a text editor, similar to other plain text editors like NotePad++, etc with built in utilities to help the lazy writers, like me, build a habit of writing. 

It features: 
- A smart editor that automatically saves as you write and has other bits and pieces that saves you time as you write.
- Word counter with the ability to set word targets and then get positive feedback on achieving those targets.
- A complete Pomodoro system to set writing session intervals so that you can use short focussed intervals to write
- A Write or Nuke feature where if you stop writing before completing the target words, everything that you wrote is cleared. This forces you to achieve your target words more often.
- Almost everything can be configured
- and a UI designed for the rest of us.

# Watch Just50Words in Action
(Coming Soon)
1. Introduction and basic operations
2. Changing the settings
3. Using the target word count feature
4. Using the timer feature
5. Using the Write or Nuke Feature

# What are the benefits
I have been using this app for the past month or so to write an article everyday. And it works.
I have never created so much content in such a short time, in my life and I believe that this editor played a very important role in it.

1. The committment is to write just 50 words. 
That is all this editor is about. Just 50 words, everyday. That takes less than 5 minutes if you type at 10 words per minutes. (Of course you can change 50 to any other number as soon as you get comfortable with it.)

2. You can use the built-in timer to set writing sessions and use Pomodoro technique for focused writing

3. Use the Write or Nuke feature to force yourself to complete atleast 50 words

4. You don't have to worry about losing data. J50W saves as you type.

5. Manage all your articles at one place. Everything that you write is available within JWT. So you can continue where you left off yesterday.

6. You focus on just writing
The built in editor is deceptively simple to use. Although you will not find anything to add fancy formatting, you will see that it is smart enough to automatically prepend your bullets, your numbers and so on. If you are familiar with MarkDown syntax, you can use that to format your text.

# Features
- A super simple editor that automatically saves as you write.
- Word counter and the ability to set target number of words. You get various visual and audio cues to motivate you to achieve the target.
- A complete Pomodoro system to set writing session intervals for focussed writing
- A Write or Nuke feature where if you stop writing before completing the target words, everything that you wrote is lost.
- Almost everything can be configured.
- A lazy writer friendly UI.

# Customizing the features
Almost everything in the editor can be customized by editing the config.json file.

WARNING: The config.json file has to be a valid JSON. So you are editing this file, you will have to ensure that there are no errors in the JSON. In a future version I will create a UI to manage config settings so this will not be an issue in future versions.
I strongly recommend using json editors like https://jsoneditoronline.org/ to edit and verify this json file before using it in the app.

## Location of the config file
Click on the config button (It is beside the 'Just 50 Words' title in the app). This will open a popup with the location of the config file on your machine.

## List of properties that can be updated
In the config.json file, you will find the following properties. You can set the values as mentioned below.

### Target related settings
      - target_words = 50;  // what is your daily target number of words. 

      - target_words_countdown_type = "to_target"; // How do you want the count down to the target be displayed. Here are the possible options:
          - word_count: This counts the words from zero to actual word count
          - to_target: It counts down from target to zero and when the target is reached, shows the actual word count typed today.
          - countdown: It shows a countdown from target to zero. When target is reached, it restarts the countdown.

      - play_target_reached_sound = true; // If set to true, it will play a sound when target words are reached.
      
      - target_reached_sound = 'assets/sound/notification-sound.mp3'; // What motivation or celebration sound to play when word count target is reached

### "Write or Nuke" related settings
      - write_or_nuke = true; // if true then the user cannot stop tying for more than "write_or_nuke_interval' seconds. 

      - write_or_nuke_interval = 30; // number of seconds to wait for keystrokes before clearing the content

      - write_or_nuke_nuked_sound = 'assets/sound/glass-breaking.mp3'; // the sound to play when the content is nuked

      - write_or_nuke_warning_sound = 'assets/sound/pin_dropping-Brian_Rocca-2084700791.mp3'; // the warning sound to play during the last few seconds before nuking

      - write_or_nuke_show_button = true; // Show or hide the write or nuke button on main screen. If false, then the main screen will not 

### Timer interval related settings
      - manually_start_session = true; // Whether the session timer should pause before starting the next session
      - play_session_completed_sound = true; // Should we play the sounds related to completed the sessions and breaks
      - session_celebration_duration = 3; // how long will the celebration banner last
      - work_session = 15; // minutes to work
      - work_session_complete_sound = 'assets/sound/relentless.mp3';
      - short_break = 5; // short break sessions
      - short_break_complete_sound = 'assets/sound/filling.mp3';
      - continuous_sessions = 3; // how many sessions in one set. Big break after these number of small breaks
      - long_break = 15; // how long will the long break be after continuous session counts
      - long_break_complete_sound = 'assets/sound/filling.mp3';

### Look and feel related settings
      - editor_bg = 'url("assets/images/bg-dirty-paper.jpg")'; // background image for the editor or use a color name 'white' to set a solid color.

      - editor_text_color = 'black'; // the color of the text in the editor

      - editor_max_width = 800; // max width of editor in pixels. This is useful if you are writing in full screen mode and you do not want the editor to stretch from one edge to the other.
      
      - play_keypress_sound = true; // If set to true, this will replicate the sounds made by old typewriters. So every key press will generate a 'tick' sound. Helps to focus in writing.

      - keypress_sound = 'assets/sound/tick.wav'; //this is the sound file that has the 'tick' sound. You can can give absolute path names of any other sound file if you want to change that.

# Planned Features
What you see here is part of the long journey that I have planned for Just 50 words. Most of these are doable, I just need more time to build them. Some of them are wishful thinking, but they are here anyway.

Visit this page later to download the latest version:
- [ ] UI for configuration. Right now it has to be done by editing the config.json file and restarting the app
- [ ] Streaks: A visual overview of the writing streak of number of continuous days when I wrote more than the target number of words
- [ ] Tags: Creating and filtering by tags
- [ ] Treeview of the content structure to enable me to get a high level overview of the article that I am creating and jump to different sections
- [ ] Text expansion and replacement for auto-corrections, shortcuts, templates etc
- [ ] Template system for creating separate starting templates for different article types.
- [ ] Wizard to get started with the writing. I would be able to select a suitable wizard, say 'Story with Heroes Journey' and I would be presented with one question at a time to answer and my basic story structure would be ready at the end
- [ ] Headline suggestion based on my keyword to kickstart the planning and writing process
- [ ] Content quality review  with ability to suggest synonyms, identify long sentences, replace repeated expressions etc
- [ ] Generate an article 'mood board' based on links I provide. So I would be able to provide a list of urls and it would generate a scrap book with summaries from all those urls. 

# How to ask for help
- Check out the videos tutorials at `Coming Soon`
- Report a bug or ask a question at https://github.com/gunjankarun/just50words/issues
- Request a new feature at https://github.com/gunjankarun/just50words/issues/new?title=[Feature+Request]:
- Email me at gunjan@kalptaru.in

# How to help
- You can donate using Paypal to gunjan@kalptaru.in
This helps me pay the bills for me and my kids and gives me time and *motivation* to work on this app

- If you know Javascript and are familiar with Angular2 and Electron then you can review the code, suggest changes, fix bugs or add new features. Just download or clone the source code from https://github.com/gunjankarun/just50words and do whatever you want.

- If you are a user of this app, then you can report bugs, suggest new features and share this app in your network. Help me improve this software as a user. I would also love to hear from you.  

- If you write articles or have a blog or are active on social media, then a review of this app will help me a lot. I would love to discuss any specific detail i.e. the technology involved, philosophy etc.

- Hire me. If you have a project that uses Blockchain, AI, Machine Learning, Electron, NodeJS, Ionic for mobile etc, I can help. 