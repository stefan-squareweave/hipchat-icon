This repo contains the code which runs my Hipchat notification icon. It consists of the following:

* icon-server - A simple webserver which provides an API which toggles a system tray icon.
* systemd - A systemd service description which starts the icon server on boot
* userscript.js - A [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) userscript which sends messages to the icon server when things change in Hipchat.

# Installation

1. Make a separate Chrome instance for hipchat. Install Tampermonkey
2. Clone this repo to ~/bin/mine/hipchat-icon
3. Run the following command inside the icon-server directory: openssl req -new -nodes -x509 -subj "/C=AU/ST=Victoria/L=Melbourne/O=ZZ Squareweave/CN=localhost" -days 3650 -keyout server.key -out server.crt -extensions v3_ca -sha256
4. Ensure the paths are correct in hipchat-icon.service
5. Symlink hipchat-icon.service to ~/.config/systemd/user/hipchat-icon.service.
6. Run systemctl --user enable ~/.config/systemd/user/hipchat-icon.service.
7. Run systemct start hipchat-icon . You should see an icon in your system tray.
8. Add the server.crt as a CA to your hipchat chrome instance.
9. Install the userscript.js as a tampermonkey userscript. Reload the hipchat tab.
10. Open the network tab on the chrome inspector. Check that communications are going from the userscript to the python web server.
11. Get someone to send you a message. If things go well, the system tray icon should go red. If it doesn't, hopefully you'll get something logged to either 
