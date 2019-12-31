
function t(t, e, a) {
  return e in t ? Object.defineProperty(t, e, {
    value: a,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = a, t;
}

var e = getApp();

Page({
  data: {
    UPLOADING: "UPLOADING",
    PROCESSING: "PROCESSING",
    FINISHED: "FINISHED",
    ERROR: "ERROR",
    cookie: "",
    tasks: [],
    actions:[
        {
          name: '从相册获取',
          color: '#ff9900',
          icon: 'picture'
        },
        {
          name: '从聊天记录获取',
          color: '#ff9900',
          icon: 'interactive'
        }       
    ],
    modelVisible:false
  },
  handlers: new Map(),
  onLoad: function (t) {
    //this.setData({
    //  cookie: decodeURIComponent(t.cookie)
    //}), this.choose(!0);
  },
  onUnload: function () {
    var t = !0, e = !1, a = void 0;
    try {
      for (var n, s = this.data.tasks.filter(function (t) {
        return "UPLOADING" == t.state;
      })[Symbol.iterator](); !(t = (n = s.next()).done); t = !0) {
        var o = n.value;
        this.handlers.get(o.name).abort();
      }
    } catch (t) {
      e = !0, a = t;
    } finally {
      try {
        !t && s.return && s.return();
      } finally {
        if (e) throw a;
      }
    }
  },
  choose: function () {
    var t = this, e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    wx.chooseMessageFile({
      count: 1,
      type: 'image',
      extension: ["jpg","png","jpeg"],
      success: function (e) {
        var a = new Set(e.tempFiles.map(function (t) {
          return t.name;
        }));
        if (t.data.tasks.filter(function (t) {
          return a.has(t.name);
        }).length) wx.showModal({
          content: "不可重复上传文件名相同的文件，如果此文件之前上传失败，请先从列表中将其关闭",
          showCancel: !1
        }); else {
          var n = !0, s = !1, o = void 0;
          try {
            for (var r, i = e.tempFiles[Symbol.iterator](); !(n = (r = i.next()).done); n = !0) {
              var u = r.value;
              t.upload(u);
            }
          } catch (t) {
            s = !0, o = t;
          } finally {
            try {
              !n && i.return && i.return();
            } finally {
              if (s) throw o;
            }
          }
        }
      },
      fail: function () {
        //e && wx.redirectTo({
        //  url: "/pages/index/index"
        //});
      }
    });
  },

  chooseImages:function(){
    var t = this, e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    wx.chooseImage({
      count: 1,

      extension: ["jpg", "png", "jpeg"],
      success: function (e) {
        var a = new Set(e.tempFiles.map(function (t) {
          return t.name;
        }));
        if (t.data.tasks.filter(function (t) {
          return a.has(t.name);
        }).length) wx.showModal({
          content: "不可重复上传文件名相同的文件，如果此文件之前上传失败，请先从列表中将其关闭",
          showCancel: !1
        }); else {
          var n = !0, s = !1, o = void 0;
          try {
            for (var r, i = e.tempFiles[Symbol.iterator](); !(n = (r = i.next()).done); n = !0) {
              var u = r.value;
              t.upload(u);
            }
          } catch (t) {
            s = !0, o = t;
          } finally {
            try {
              !n && i.return && i.return();
            } finally {
              if (s) throw o;
            }
          }
        }
      },
      fail: function () {
        //e && wx.redirectTo({
        //  url: "/pages/index/index"
        //});
      }
    });
  },

  goon: function () {
    this.choose();
  },

  closealert: function (t) {
    this.remove(t.target.dataset.task);
  },

  update: function (e) {
    if (-1 != this.data.tasks.findIndex(function (t) {
      return t.name == e.name;
    })) {
      var a = "tasks[" + this.data.tasks.indexOf(e) + "]";
      
      this.setData(t({}, a, e));
    }
  },

  remove: function (t) {
    var e = this.data.tasks;
    e.splice(this.data.tasks.findIndex(function (e) {
      return e.name == t.name;
    }), 1), this.setData({
      tasks: e
    });
  },

  abort: function (t) {
    var e = this, a = t.target.dataset.task;
    wx.showModal({
      content: "确定要终止吗？",
      success: function (t) {
        t.confirm && "UPLOADING" == a.state && (e.handlers.get(a.name).abort(), e.remove(a));
      }
    });
  },

  sethandler: function (t, a) {
    console.log(a.path.split('/').pop())
    var n = this, 
    
    s = wx.cloud.uploadFile({
      cloudPath: a.path.split('/').pop(),    
      filePath: a.path,
      success: function (e) {
       
        //t.resp = JSON.parse(e.data);
        t.state = (200 == e.statusCode ? "FINISHED" : "ERROR");
        console.log("sss",t.state);
        n.update(t);
      },
      fail: function () {
        t.state = "ERROR", t.resp = "网络错误，请在稳定的网络环境下重试", n.update(t);
      }
    });
    return this.handlers.set(a.name, s), s;
  },

  upload: function (t) {
    console.log("fileinfo",t);
    var e = this, a = {
      name: t.name,
      state: "UPLOADING",
      progress: 0,
      filePath:t.path
    };
    
    t.size > 10485760 ? (a.state = "ERROR", a.resp = "文件大小不能超过10MB") : this.sethandler(a, t).onProgressUpdate(function (t) {
      a.progress = t.progress, 100 == a.progress && (a.state = "PROCESSING"), e.update(a);
    }), this.data.tasks.push(a), this.setData({
      tasks: this.data.tasks
    });
  },

  nextstep: function () {
    console.log("task",this.tasks);
    if (this.data.tasks.length == 0) {
      //if you dont choose any item it will not go on.
      wx.showModal({
        content: "至少提交一个文件项目",
        showCancel: 0
      });
      return;
    }
    var t = function () {
      
      wx.navigateTo({
        url: "/pages/info/info"
      })    
    };
    this.data.tasks.map(function (t) {
      return t.state;
    }).reduce(function (t, e) {
      return t && ("FINISHED" == e || "ERROR" == e);
    }, !0) ? t() : wx.showModal({
      content: "还有文档正在上传中，返回将丢失这部分文档，确认继续吗？",
      success: function (e) {
        e.confirm && t();
      }
    });
  },

  handleModelOpen() {
    this.setData({
      modelVisible: true
    });
  },

  handleClickChooseFileBtn({ detail }) {
    const index = detail.index;

    if (index === 0) 
    {
      this.chooseImages();
    } 
    else if (index === 1) 
    {
      this.choose();
    }
    this.setData({
      modelVisible: false
    });
  }

});