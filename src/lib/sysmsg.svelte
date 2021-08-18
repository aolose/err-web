<script>
    import {msg} from './store'
    import {onDestroy} from "svelte";

    const base = 'abcdefghijklmnopqrstuvwxyz齉齾爩鱻' +
        '麤龗灪吁龖厵滟爨癵籱饢驫鲡鹂鸾麣纞虋讟钃骊郁鸜' +
        '麷鞻韽韾响顟顠饙饙騳騱饶饐ㄅㄧㄥㄒㄧㄢㄘㄨ';
    const l = base.length;
    let pv = '';
    let pr = '';
    let a = 0;
    let t = -1;
    const defaultText = "version 0.0.1"
    onDestroy(msg.subscribe(() => {
        pv = ''
    }));
    $:{
        clearTimeout(t);
        if ($msg && ($msg + ' ' !== pv)) {
            t = setTimeout(function () {
                if (a++ < 3) {
                    pr = base[Math.floor(Math.random() * l)];
                } else {
                    clearTimeout(t);
                    t = -1;
                    a = 0;
                    pr = '';
                    pv = $msg.substr(0, pv.length + 1) + ' ';
                }
            }, 50)
        } else {
            if ($msg !== defaultText)
                t = setTimeout(function () {
                    setTimeout(function () {
                        msg.set(defaultText)
                        pv = ''
                    }, 1000)
                }, 5000)
        }
    }
</script>
<p>
    {pv}{pr}
</p>
<style>
    p {
        white-space: nowrap;
        position: absolute;
        right: 30px;
        bottom: 15px;
        max-width: 70%;
        overflow: hidden;
        text-align: right;
        text-overflow: ellipsis;
        color: #00a1ff;
    }
</style>