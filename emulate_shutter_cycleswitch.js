 /**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script can emulate a cycle switch for a remote Shelly 2.5 in roller shutter mode
 * with a Shelly Plus device.
 * Once the button is pushed it checks the former direction and sends a open, stop or close 
 * command to the remote Shelly 2.5.
 */
 
// CONFIG START
// this is the remote shelly which we want to control.
// Input is the number of the switch

let CONFIG = {
    ip: '192.168.178.209',
    input: 0,
    btnevent1: 'btn_down',
    btnevent2: 'btn_up'
};
// CONFIG END

// no need to change anything below this line..

// add an evenHandler for button type input and single push events
Shelly.addEventHandler(
    function (event, user_data) {
        //print(JSON.stringify(event));
        if (typeof event.info.event !== 'undefined') {
            if (event.info.id === CONFIG.input && (event.info.event === CONFIG.btnevent1 || event.info.event === CONFIG.btnevent2) {
                getCurrentState(CONFIG.ip);
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
);

// query a remote shelly and determine if next step is open, stop or close
function getCurrentState(ip) {
    Shelly.call(
        "http.get", {
            url: 'http://' + ip + '/roller/0'
        },
        function (res, error_code, error_message, ud) {
            if (res.code === 200) {
                let st = JSON.parse(res.body);
                if (st.state === 'stop' && st.last_direction === 'close') {
                    controlShutter(CONFIG.ip, 'open');
                    print("open shutter");
                } else if (st.state === 'stop' && st.last_direction === 'open') {
                    controlShutter(CONFIG.ip, 'close');
                    print("close shutter");
                } else {
                    controlShutter(CONFIG.ip, 'stop');
                    print("stop shutter");
                }
            }
        },
        null
    );
};

// send shutter command 
function controlShutter(ip, command) {
    Shelly.call(
        "http.get", {
            url: 'http://' + ip + '/roller/0?go=' + command
        },
        function (response, error_code, error_message, ud) {

        },
        null
    );
};
