const now = new Date();
const defaultTimeStr = now.toISOString().slice(0, 19).replace('T', ' ');

new Vue({
    el: '#app',
    mounted() {
        // 生命周期Mounted
        this.startClock();
        this.checkAutoLogin();
    },
    data() {
        return {
            // 登录相关
            showLogin: true,
            isLoggedIn: false,
            loginLoading: false,
            loginForm: {
                username: '',
                password: ''
            },
            currentTime: this.getCurrentTime(),

            form: {
                deviceType: 'spreader',
                cutterSeries: 'procom',
                baseTime: defaultTimeStr,
                snCode: '' // 初始为空，生成时填充
            },
            previewJson: null,
            previewData: null,
            previewTitle: '',
            loading: false
        };
    },
    methods: {
        getCurrentTime() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            return `${h}:${m}:${s}`;
        },

        startClock() {
            // 每1秒更新一次时间（足够用于参考）
            setInterval(() => {
                this.currentTime = this.getCurrentTime();
            }, 1000);
        },

        // =============== 登录逻辑 ===============
        async handleLogin() {
            if (!this.loginForm.username || !this.loginForm.password) {
                this.$message.warning('请输入用户名和密码');
                return;
            }

            this.loginLoading = true;
            try {
                const res = await axios.post('/spreader/fakeData/verify', {
                    username: this.loginForm.username.trim(),
                    password: this.loginForm.password.trim()
                });

                if (res.data.success) {
                    this.$message.success('✅ 登录成功！');
                    this.isLoggedIn = true;
                    this.showLogin = false;
                    localStorage.setItem('fakeDataAuth', Date.now().toString());
                } else {
                    this.$message.error(res.data.message || '登录失败');
                }
            } catch (err) {
                console.error(err);
                this.$message.error('网络错误，请检查后端服务是否启动');
            } finally {
                this.loginLoading = false;
            }
        },

        checkAutoLogin() {
            const cached = localStorage.getItem('fakeDataAuth');
            if (cached) {
                const now = Date.now();
                const cacheTime = parseInt(cached, 10);
                if (now - cacheTime < 1 * 60 * 1000) {
                    this.isLoggedIn = true;
                    this.showLogin = false;
                    return;
                }
            }
            this.showLogin = true;
        },

        // =============== 数据生成逻辑 ===============
        resetForm() {
            this.form = {
                deviceType: 'spreader',
                cutterSeries: 'procom',
                baseTime: defaultTimeStr,
                snCode: ''
            };
            this.previewJson = null;
            this.previewData = null;
        },

        generatePreview() {
            const startTime = this.form.baseTime; // "2026-01-07 11:30:00"
            const durationMin = Math.floor(Math.random() * 26) + 5; // 5 ～ 30 分钟
            const endTime = this.addMinutes(startTime, durationMin);

            // 自动生成 SnCode（如果用户未输入）
            const snCode = this.form.snCode || ('SN-' + this.randomString(12));

            let data = {};

            if (this.form.deviceType === 'spreader') {
                data = {
                    SpeadID: this.randomString(10),
                    OrderID: this.randomString(8),
                    OrderDate: startTime.split(' ')[0],
                    ClothID: this.randomString(6),
                    Deylot: this.randomString(5),
                    MarkLenght: (Math.random() * 100).toFixed(2),
                    Pieces: Math.floor(Math.random() * 50) + 1,
                    StartDate: startTime,
                    EndDate: endTime,
                    Layers: Math.floor(Math.random() * 20) + 1,
                    Length: (Math.random() * 50).toFixed(2),
                    OperatorID: 'OP' + Math.floor(Math.random() * 1000),
                    State: 1,
                    CadID: this.randomString(7),
                    RunTime: durationMin * 60, // 秒
                    WaitTime: Math.floor(Math.random() * 300),
                    Cut: Math.floor(Math.random() * 100),
                    Tight: Math.floor(Math.random() * 10),
                    Sharpen: Math.floor(Math.random() * 20),
                    CutWidth: Math.floor(Math.random() * 50),
                    Speed: Math.floor(Math.random() * 100),
                    RollOrFold: Math.floor(Math.random() * 2),
                    CutSpeed: Math.floor(Math.random() * 80),
                    RiseHeight: Math.floor(Math.random() * 30),
                    SharpenLayers: Math.floor(Math.random() * 15),
                    SharpenTime: Math.floor(Math.random() * 180),
                    TobRight: Math.floor(Math.random() * 5),
                    TobLeft: Math.floor(Math.random() * 5),
                    RecycleRight: Math.floor(Math.random() * 3),
                    RecycleLeft: Math.floor(Math.random() * 3),
                    Limite: Math.floor(Math.random() * 100),
                    LengthParam: Math.floor(Math.random() * 3),
                    BucketFrequency: Math.floor(Math.random() * 200),
                    DropFrequency: Math.floor(Math.random() * 150),
                    AcceleratDistance: Math.floor(Math.random() * 100),
                    ForwardAccelerat: Math.floor(Math.random() * 50),
                    RetreatAccelerat: Math.floor(Math.random() * 50),
                    SnCode: snCode,
                    Sync: 1
                };
                this.previewTitle = '铺布机数据 (SpreadBeanGK)';
            } else if (this.form.cutterSeries === 'procom') {
                data = {
                    marker: this.randomString(12) + '.NC',
                    paramfile: this.randomString(10) + '.param',
                    order: this.randomString(8),
                    operator: 'OP' + Math.floor(Math.random() * 1000),
                    cutDistance: (Math.random() * 2000).toFixed(2),
                    posDistance: (Math.random() * 800).toFixed(2),
                    penDistance: (Math.random() * 400).toFixed(2),
                    contourDistance: (Math.random() * 1000).toFixed(2),
                    markerLength: (Math.random() * 2000).toFixed(2),
                    markerHeight: (Math.random() * 1500).toFixed(2),
                    jobTime: durationMin * 60,
                    cutTime: (durationMin * 0.7 * 60).toFixed(2),
                    dryHaulCutTime: (Math.random() * 120).toFixed(2),
                    contourTime: (Math.random() * 80).toFixed(2),
                    penTime: (Math.random() * 50).toFixed(2),
                    dryHaulPenTime: (Math.random() * 20).toFixed(2),
                    biteTime: (Math.random() * 30).toFixed(2),
                    secondaryTime: (Math.random() * 20).toFixed(2),
                    breakTime: (Math.random() * 60).toFixed(2),
                    abortTime: (Math.random() * 30).toFixed(2),
                    timeOfStart: startTime,
                    timeOfEnd: endTime,
                    time: startTime,
                    dateOfStart: startTime.split(' ')[0],
                    dateOfEnd: endTime.split(' ')[0],
                    date: startTime.split(' ')[0],
                    v: (Math.random() * 800).toFixed(2),
                    vMax: (Math.random() * 1000).toFixed(2),
                    vMin: (Math.random() * 150).toFixed(2),
                    custom39: (Math.random() * 1.2).toFixed(3),
                    custom40: (Math.random() * 1.2).toFixed(3),
                    custom282: (Math.random() * 600).toFixed(2),
                    custom707: (Math.random() * 400).toFixed(2),
                    timeMaxTA: (Math.random() * 3).toFixed(2),
                    timeMaxR: (Math.random() * 80).toFixed(2),
                    ax3MaxV: Math.floor(Math.random() * 4000),
                    timeMaxTAForPositioning: Math.floor(Math.random() * 8),
                    hubVMin: Math.floor(Math.random() * 800),
                    hubVMax: Math.floor(Math.random() * 2500),
                    ignoredPoints: Math.floor(Math.random() * 80),
                    points: Math.floor(Math.random() * 8000),
                    segs: Math.floor(Math.random() * 400),
                    ignoredSegs: Math.floor(Math.random() * 40),
                    xZoom: (Math.random() * 1.5).toFixed(3),
                    yZoom: (Math.random() * 1.5).toFixed(3),
                    sharpen: Math.floor(Math.random() * 25),
                    slit: Math.floor(Math.random() * 150),
                    stitch: Math.floor(Math.random() * 120),
                    vNotch: Math.floor(Math.random() * 80),
                    drill: Math.floor(Math.random() * 60),
                    helprDrill: Math.floor(Math.random() * 40),
                    matchinGpoint: Math.floor(Math.random() * 25),
                    toolDown: Math.floor(Math.random() * 800),
                    labels: Math.floor(Math.random() * 150),
                    sections: Math.floor(Math.random() * 40),
                    layer: Math.floor(Math.random() * 15),
                    machineid: 'M-' + this.randomString(8),
                    snCode: snCode
                };
                this.previewTitle = '裁床 Procom (D系列)';
            } else {
                data = {
                    version: 'V' + (Math.floor(Math.random() * 5) + 3) + '.' + Math.floor(Math.random() * 10),
                    fileName: this.randomString(12) + '.GBR',
                    parameter: this.randomString(10) + '.param',
                    loadTime: startTime,
                    markerSize: (Math.random() * 2000).toFixed(2) + 'x' + (Math.random() * 1500).toFixed(2),
                    cuttingTime: (durationMin * 0.6 * 60).toFixed(2),
                    positionTime: (Math.random() * 80).toFixed(2),
                    bitefeedTime: (Math.random() * 30).toFixed(2),
                    workTime: durationMin * 60,
                    pauseTime: (Math.random() * 50).toFixed(2),
                    sharpTime: (Math.random() * 25).toFixed(2),
                    drill1Time: (Math.random() * 15).toFixed(2),
                    drill2Time: (Math.random() * 10).toFixed(2),
                    cuttingLength: (Math.random() * 2000).toFixed(2),
                    positionLength: (Math.random() * 800).toFixed(2),
                    markerXLength: (Math.random() * 2000).toFixed(2),
                    maxSpeed: (Math.random() * 1000).toFixed(2),
                    minSpeed: (Math.random() * 150).toFixed(2),
                    averageSpeed: (Math.random() * 600).toFixed(2),
                    parts: Math.floor(Math.random() * 400),
                    INotch: Math.floor(Math.random() * 150),
                    VNotch: Math.floor(Math.random() * 80),
                    liftKnifeCycle: Math.floor(Math.random() * 800),
                    sharpCycle: Math.floor(Math.random() * 25),
                    drill: Math.floor(Math.random() * 60),
                    drill2: Math.floor(Math.random() * 40),
                    XZoom: (Math.random() * 1.5).toFixed(3),
                    YZoom: (Math.random() * 1.5).toFixed(3),
                    totalWindow: Math.floor(Math.random() * 40),
                    ignoreParts: Math.floor(Math.random() * 40),
                    layer: Math.floor(Math.random() * 15),
                    pieces: Math.floor(Math.random() * 80),
                    order: this.randomString(8),
                    snCode: snCode,
                    endTime: endTime,
                    xFlip: Math.floor(Math.random() * 2),
                    yFlip: Math.floor(Math.random() * 2),
                    closeTime: this.addMinutes(endTime, 2),
                    userName: 'User' + Math.floor(Math.random() * 100),
                    markerPath: '/markers/' + this.randomString(10),
                    pauseNum: (Math.random() * 5).toFixed(1),
                    offlineTime: this.addMinutes(startTime, -2),
                    markerLength: (Math.random() * 5000).toFixed(2)
                };
                this.previewTitle = '裁床 Procut (E系列)';
            }

            this.previewData = data;
            this.previewJson = JSON.stringify(data, null, 2);
        },
        // 防止用户输入空格
        handleSnInput(val) {
            this.form.snCode = val.trim();
        },
        randomString(len) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            return Array.from({ length: len }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        },

        addMinutes(dateTimeStr, minutes) {
            const dt = new Date(dateTimeStr.replace(' ', 'T'));
            dt.setMinutes(dt.getMinutes() + minutes);
            return dt.toISOString().slice(0, 19).replace('T', ' ');
        },

        copyToClipboard() {
            navigator.clipboard.writeText(this.previewJson).then(() => {
                this.$message.success('JSON 已复制到剪贴板');
            });
        },

        confirmSend() {
            this.$confirm(`确定将 ${this.previewTitle} 发送到后端？`, '确认发送', {
                confirmButtonText: '发送',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.sendToBackend();
            }).catch(() => {});
        },

        async sendToBackend() {
            this.loading = true;
            let url = '';
            if (this.form.deviceType === 'spreader') {
                url = '/receiveData';
            } else if (this.form.cutterSeries === 'procom') {
                url = '/smartCut/receiveData';
            } else {
                url = '/smartCut/receiveEData';
            }

            try {
                const res = await axios.post(url, this.previewData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                if (res.data.includes('Success')) {
                    this.$message.success('✅ 数据已成功发送至后端！');
                } else {
                    throw new Error('未知响应');
                }
            } catch (error) {
                console.error(error);
                this.$message.error('❌ 发送失败：' + (error.message || '网络错误'));
            } finally {
                this.loading = false;
            }
        }
    }
});