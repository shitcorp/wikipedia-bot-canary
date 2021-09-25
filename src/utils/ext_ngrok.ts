import ngrok from 'ngrok';
import { combineArrays } from '.';
(async function () {
  const updater = {
    'Tunnel Status': 'connecting',
    'Tunnel Url': 'connecting',
    'Latest Log': 'connecting'
  };
  const update = () => {
    console.clear();
    console.table(updater);
  };

  const token = process.env.NGROK_TOKEN;
  const url = await ngrok.connect({
    proto: 'http',
    addr: 8020,
    authtoken: token,
    onLogEvent: (data: any) => {
      const temp = data.split('=');
      const keys = ['t'];
      const values = [];
      temp.forEach((element) => {
        const temp2 = element.split(' ');
        if (temp2.length <= 1) return;
        keys.push(temp2.pop());
        values.push(temp2.join(' '));
      });
      values.push(temp[temp.length - 1]);
      const log = combineArrays(keys, values);
      updater['Latest Log'] = log.msg;
      if (log.status) updater['Latest Log'] = updater['Latest Log'] + ' Stat: ' + log.status;
      if (log.url) updater['Latest Log'] = updater['Latest Log'] + ' Url: ' + log.url;
      if (log.dur) updater['Latest Log'] = updater['Latest Log'] + ' Dur: ' + log.dur;
      update();
    },
    onStatusChange: (status) => {
      updater['Tunnel Status'] = status;
      update();
    }
  });
  updater['Tunnel Url'] = url;
  update();
})();
