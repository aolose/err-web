<script>
    import {onDestroy, onMount} from "svelte";

    let cvs, w, h, task = {};

    const r180 = 180 / Math.PI

    function fn(a, r = 100) {
        a = a % 360
        return [
            (0.5 + Math.abs(Math.sin(a / r180)) / 2) * r,
            (0.5 + Math.abs(Math.cos(a / r180)) / 2) * r
        ]
    }

    let stop = 0

    function o(a) {
        return a / 180 * Math.PI
    }

    function run() {
        if (stop) return;
        const {t} = task;
        t && t()
        requestAnimationFrame(run)
    }

    onMount(run);

    onDestroy(() => {
        stop = 1;
    })

    $:{
        if (cvs) {
            cvs.width = w
            cvs.height = h
            const th = Math.min(60 + 15 * Math.min(800 / w, 1), 180)
            const ww = w / 2 + Math.min(w / 8, 100)

            const ctx = cvs.getContext('2d')
            let a = 0, b = 0;


            function drawCurve(th, ow) {
                ctx.beginPath()
                ctx.moveTo(w / 2 , 0)
                const sinN = Math.sin(o(th))
                const cosN = Math.cos(o(th))
                const c = h / sinN
                const sp = c / 3

                function cr(n, k, vv = w) {
                    const w = vv / 2;
                    const t = n + sp
                    const [rx, ry] = fn(a, (sp * (k || -1)) / 4)
                    const [x, y] = pos(t)
                    const [x0, y0] = pos(t - sp / 2)
                    const [x1, y1] = [x0 + rx, y0 + ry]
                    ctx.quadraticCurveTo(x1, y1, x, y)
                }

                function pos(n) {
                    const y = n * sinN
                    const x = n * cosN
                    return [w - x - ow, y]
                }

                const st = Math.floor(b/sp)+2
                for (let i = -st; i < -st+5; i++) {
                    cr(b + sp * i, Math.abs(i % 2))
                }
            }

            function draw(m, n) {
                a += 0.2
                b++
                a = a % 360;
                ctx.clearRect(0, 0, w, h)
                ctx.beginPath();
                ctx.moveTo(w / 2, 0)
                drawCurve(m, n)
                ctx.lineTo(w / 2 , h)
                ctx.fill()
                drawCurve(90, w / 2 - 200)
                ctx.lineTo(w / 2, h)
                ctx.fill()
                const k = 2
                const p = n / k /20
                ctx.strokeStyle = '#ffffff'
                drawCurve(m - k, n - p)
                ctx.stroke()
                drawCurve(88, w / 2 - 210)
                ctx.stroke()
                ctx.strokeStyle = '#000'
                drawCurve(m - k, n - p - 1)
                ctx.stroke()
                drawCurve(88, w / 2 - 211)
                ctx.stroke()
            }

            task.t = () => {
                draw(th, ww)
            }
        }
    }
</script>
<div class="ctx"
     bind:offsetWidth={w}
     bind:offsetHeight={h}
>
    <canvas bind:this={cvs}></canvas>
</div>
<style lang="scss">
  canvas {
    display: block;
  }

  .ctx {
    background: #fff;
    position: absolute;
    left: 0;
    top: 0;
    right: -100%;
    bottom: 0;
  }
</style>