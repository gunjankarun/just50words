# What is "Just 50 words"
Just 50 words is a text editor, similar to other plain text editors like NotePad++, etc with built in utilities to help the lazy writers, like me, build a habit of writing. 

It features: 
- A super simple editor that automatically saves as you write.
- Word counter with the ability to set word targets and then get positive feedback on achieving those targets.
- A complete Pomodoro system to set writing session intervals so that you can use short focussed intervals to write
- A Write or Nuke feature where if you stop writing before completing the target words, everything that you wrote is cleared.
- Almost everything can be configured
- A lazy writer friendly UI.

# Target Audience
Anybody who writes regularly for example those who write blog posts, articles, essays, fiction etc will benefit from Just 50 Words.

# What are the benefits
I have been using this app for the past month or so to write an article everyday. And it works.
I have never created so much content in such a short time, in my life and I believe that this editor played a very important role in it.

1. It motivates you to write just 50 words. 
That is all this editor is about. Just 50 words, everyday. That takes less than 5 minutes if you type at 10 words per minutes.

2. You can use the built in timer to set writing sessions

3. Use the Write or Nuke feature to force yourself to complete atleast 50 words

4. You don't have to worry about losing data

5. Manage all your articles at one place

6. You focus on just writing
    The built in editor is deceptively simple to use. Although you will not find anything to add fancy formatting, you will see that it is smart enough to automatically prepend your bullets, your numbers and so on. If you are familiar with MarkDown syntax, you can use that to format your text.

# Features
- A super simple editor that automatically saves as you write.
- Word counter and the ability to set targets
- A complete Pomodoro system to set writing session intervals
- A Write or Nuke feature where if you stop writing before completing the target words, everything that you wrote is cleared.
- Almost everything can be configured
- A lazy writer friendly UI.

# Screens
 
# Videos
1. Introduction and basic operations
2. Changing the settings
3. Using the target word count feature
4. Using the timer feature
5. Using the Write or Nuke Feature

# Customizing the features
Almost everything in the editor can be customized by editing the config.json file.

WARNING: The config.json file has to be a valid JSON. So you will have to ensure that there are no errors in the JSON. In a future version I will create a UI to manage config settings.
I strongly recommend using json editors like https://jsoneditoronline.org/ to edit and verify this json file before using it in the app.

## Location of the file
### Windows
### Mac
### Ubuntu

## List of properties that can be updated
### Look and feel related settings

      - editor_bg: 'url("assets/images/bg-dirty-paper.jpg")' 
      // background image for the editor. When using image, url url('image_url')
      // or use a solid color like 'black', 'white' etc.; 
      // you can use color names or hex codes like #fffff for white etc from http://htmlcolorcodes.com/color-names/
      
      
      - editor_text_color: 'black'
      // color of the text. Use any html5 color names or html color codes.
      // you can use color names or hex codes like #fffff for white etc from http://htmlcolorcodes.com/color-names/

      - editor_max_width: 800 
      // max width of editor in pixels. This width is used to add padding to the editor when the width of editor is more than this pixel.

      - mute_all_sounds: false 
      // global setting to mute all sounds (key press sounds, target complete sound etc.) irrespective of their individual settings
      
      - play_keypress_sound: true
      // Play the sound of typewriter key press as you type. Helps to focus on writing
      
      - keypress_sound: 'assets/sound/tick.wav'
      // this is the sound file that will be played when you press any key. If you want to use your own sound, put the absolute file path here.

### Target related settings
      - target_words: 50
      // This is the target of words you want to write each day for each article. This will affect the write or nuke feature and also the word countdowns etc

      - target_words_countdown_type: Constants.WORD_COUNT_TYPE.WORD_COUNT;
      // There are three kinds of word countdowns that can be see in the editor. The possible values are
      // 'to_target' - This will start a countdown from -target to zero and then will show actual words typed after target is reached. For example, until target is reached, it will be -50 to 0 and then 51 onwards
      // 'word_count' - This will be show the actual word count. It will always start from zero and will show a success message as soon as target words are typed.
      // 'countdown' - This will show a countdown from -target to zero. When target is reached, it will start the countdown again.

      - play_target_reached_sound: true
      // Do you want to play a sound when you have typed the target number of words

      - target_reached_sound: 'assets/sound/notification-sound.mp3'
      // What sound to play when the target is reached. If you want to use your own sound, put the absolute file path here.


### "Write or Nuke" related settings
      - write_or_nuke: true 
      // Do you want to enable the write or nuke feature. 
      // WARNING: If you enable it then you must not stop typing until your target number of words are complete. Otherwise it will delete everything from that article.

      - write_or_nuke_interval: 30
      // Number of seconds to wait before nuking the content. So if it is 30 then the contents will be nuked if you stop typing for more than 30 seconds.

      - write_or_nuke_show_button: true 
      // Show or hide the write or nuke button on main screen. Many people prefer to hide this button because it makes it difficult to disable this feature. If you select true, then the editor will show a button on the main screen that will let you disable the Write or Nuke option to prevent clearing of content.

      - write_or_nuke_warning_sound: 'assets/sound/pin_dropping-Brian_Rocca-2084700791.mp3'
      // what sound to play a few seconds before nuking the content. If you want to use your own sound, put the absolute file path here.

      - write_or_nuke_nuked_sound: 'assets/sound/glass-breaking.mp3'
      // what sound to play when the countent is nuked. If you want to use your own sound, put the absolute file path here.


### Timer interval related settings
      - manually_start_session: true
      // If you set this to true, then once a work and break session is over, the timer will pause. This allows you to start the timer when you start working again. If you set it to false, the timer will start automatically.

      - play_session_completed_sound: true
      // Should we play the sounds related to completed the sessions and breaks. If you want to use your own sound, put the absolute file path here.

      - work_session: 15
      // how many minutes would be there in the work session.

      - work_session_complete_sound: 'assets/sound/relentless.mp3'
      // Do you want to play a notification sound when work session is complete. If you want to use your own sound, put the absolute file path here.

      - short_break: 5
      // how many minutes will the short break last 

      - short_break_complete_sound = 'assets/sound/filling.mp3';
      // do you want to play a notification sound when short break is over.

      - continuous_sessions = 3; 
      // how many sessions (work session + short break) should be there in one set. 
      // you can configure a bigger break after these number of small breaks

      - long_break = 15; 
      // how long (in minutes) will the long break be after continuous session counts

      - long_break_complete_sound = 'assets/sound/filling.mp3';
      // what sound to play when the long break is over. If you want to use your own sound, put the absolute file path here.

# Planned Features
What you see here is part of the long journey that I have planned for Just 50 words. Most of these are doable, I just need more time to build them. Some of them are wishful thinking, but they are here anyway.

Either use the feature to check for updates in your app to get new updates or keep visiting this page to download the latest version.
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

??? # Alternatives ???
This is not the only editor that has been trying to solve the issue of procrastination for writers. There are other softare

# How to ask for help
- Check out the videos tutorials at XXXX
- Ask a question at XXXX
- Report a bug at XXXX
- Request a new feature at XXXX
- Email me
- Tweet about it 

# How to help
- You can donate using Paypal to gunjan@kalptaru.in
This helps me pay the bills for me and my kids and gives me time and *motivation* to work on this app

- If you know Javascript and are familiar with Angular2 and Electron then you can review the code, suggest changes, fix bugs or add new features. Just download or clone the source code from XXXX and do whatever you want.

- If you are a user of this app, then you can report bugs, suggest new features and share this app in your network. Help me improve this software as a user. I would also love to hear from you.  

- If you write articles or have a blog or are active on social media, then a review of this app will help me a lot. I would love to discuss any specific detail i.e. the technology involved, philosophy etc.

- Hire me. If you have a project that uses Blockchain, AI, Machine Learning, Electron, NodeJS, I can help.
