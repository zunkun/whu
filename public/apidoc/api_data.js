define({ "api": [
  {
    "type": "POST",
    "url": "/api/questionnaires/modify",
    "title": "修改投票",
    "name": "questionnaire_modify",
    "group": "投票管理",
    "description": "<p>修改投票，注意如果系统中已有人投票，则不允许修改title,startTime,endTime, options等字段</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>投票id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>投票标题</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "startTime",
            "description": "<p>开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "endTime",
            "description": "<p>截止时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "video",
            "description": "<p>视屏名称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "commentAllowed",
            "description": "<p>是否允许评论</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "commentVisible",
            "description": "<p>评论是否可见</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "anonymous",
            "description": "<p>是否匿名投票</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "realTimeVisiable",
            "description": "<p>实时结果是否对用户可视</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "selectionNum",
            "description": "<p>单选多选 1-单选 2-多选</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "options",
            "description": "<p>选项列表</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "options.sequence",
            "description": "<p>选项排序</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "options.title",
            "description": "<p>选项标题</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.image",
            "description": "<p>图片名称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "options.video",
            "description": "<p>视屏名称</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/questionnaires.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "post",
    "url": "/api/questionnaires",
    "title": "创建投票",
    "name": "questionnaires_create",
    "group": "投票管理",
    "description": "<p>创建投票</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>投票标题</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "startTime",
            "description": "<p>开始时间 格式 2019-08-23 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "endTime",
            "description": "<p>截止时间 格式 2019-08-24 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "options",
            "description": "<p>问卷选项详细信息</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "options.sequence",
            "description": "<p>选项排序 例如1,2,3</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "options.title",
            "description": "<p>选项标题</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "options.[description]",
            "description": "<p>描述</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "options.[image]",
            "description": "<p>图片名称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "options.[video]",
            "description": "<p>视屏名称</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "video",
            "description": "<p>视屏名称</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "commentAllowed",
            "description": "<p>是否允许评论,默认为 true</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "commentVisible",
            "description": "<p>评论是否可见,默认为 true</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "anonymous",
            "description": "<p>是否匿名投票，默认为 false</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "realTimeVisiable",
            "description": "<p>实时结果是否对用户可视，默认为 true</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "selectionNum",
            "description": "<p>单选多选 1-单选 2-多选, 默认为1 单选</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>投票ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/questionnaires.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "post",
    "url": "/api/questionnaires/delete",
    "title": "删除投票",
    "name": "questionnaires_del",
    "group": "投票管理",
    "description": "<p>删除投票</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>投票id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/questionnaires.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "get",
    "url": "/api/questionnaires/:id?type=",
    "title": "投票信息",
    "name": "questionnaires_info",
    "group": "投票管理",
    "description": "<p>投票信息</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>投票id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "type",
            "description": "<p>投票访问权限 1-移动端查看 2-PC端管理， 默认为1</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>投票投票ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.voteCount",
            "description": "<p>当前投票人数</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.top",
            "description": "<p>是否置顶， true置顶 false不置顶</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.title",
            "description": "<p>投票投票标题</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.video",
            "description": "<p>视屏名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.startTime",
            "description": "<p>开始时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.endTime",
            "description": "<p>结束时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userId",
            "description": "<p>发起人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userName",
            "description": "<p>发起人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.mobile",
            "description": "<p>发起人手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.createdAt",
            "description": "<p>创建时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.commentAllowed",
            "description": "<p>是否允许评论</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.commentVisible",
            "description": "<p>评论是否可见</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.anonymous",
            "description": "<p>是否匿名投票</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.realTimeVisiable",
            "description": "<p>实时结果是否对用户可视</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.selectionNum",
            "description": "<p>单选多选 1-单选 2-多选</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.depts",
            "description": "<p>投票范围部门信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.depts.deptId",
            "description": "<p>部门id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.specialUsers",
            "description": "<p>投票范围特别参与人员</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.specialUsers.userId",
            "description": "<p>人员userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.specialUsers.userName",
            "description": "<p>人员userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.onoff",
            "description": "<p>上架下架 0-上架下架未设置 1-已上架 2-已下架</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.currentTime",
            "description": "<p>查询时的时间记录</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.status",
            "description": "<p>状态，0-未开始 1-进行中 2-已结束， 请注意只有当 onoff=1 表示上架状态当前值才有意义</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.options",
            "description": "<p>选项列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.id",
            "description": "<p>选项数据ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.questionnaireId",
            "description": "<p>问卷主数据ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.sequence",
            "description": "<p>选项排序</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.title",
            "description": "<p>选项标题</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.image",
            "description": "<p>图片名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.video",
            "description": "<p>视屏名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.createdAt",
            "description": "<p>创建时间</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/questionnaires.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "get",
    "url": "/api/questionnaires?limit=&page=&title=&status=&userName=&mobile=startDate=endDate=&startTime=&endTime=",
    "title": "投票列表",
    "name": "questionnaires_lists",
    "group": "投票管理",
    "description": "<p>投票列表</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>分页条数，默认10</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>第几页，默认1</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>投票标题</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "onoff",
            "description": "<p>上架下架状态 0-上架下架未设置 1-已上架 2-已下架，不填写表示所有的</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "status",
            "description": "<p>状态，0-未开始 1-进行中 2-已结束</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userName",
            "description": "<p>发起人姓名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "mobile",
            "description": "<p>发起人手机号</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "startDate",
            "description": "<p>开始日期,格式 2019-09-24,【已废弃】请使用 startTime</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "endDate",
            "description": "<p>截止日期，格式 2019-09-30 【已废弃】请使用endTime</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "startTime",
            "description": "<p>开始日期,格式 2019-09-24 08:00:00</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "endTime",
            "description": "<p>截止日期，格式 2019-09-24 08:00:00</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>投票列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>投票总数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>当前页投票列表</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.title",
            "description": "<p>投票投票标题</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.voteCount",
            "description": "<p>当前已投票人数</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.rows.top",
            "description": "<p>是否置顶， true置顶 false不置顶</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.startTime",
            "description": "<p>开始时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.endTime",
            "description": "<p>结束时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.onoff",
            "description": "<p>上架下架 0-上架下架未设置 1-已上架 2-已下架</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.currentTime",
            "description": "<p>访问服务器接口的时间记录</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.status",
            "description": "<p>状态，0-未开始 1-进行中 2-已结束， 请注意只有当 onoff=1 表示上架状态当前值才有意义</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userId",
            "description": "<p>发起人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userName",
            "description": "<p>发起人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.mobile",
            "description": "<p>发起人手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.createdAt",
            "description": "<p>创建时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.depts",
            "description": "<p>投票范围</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptId",
            "description": "<p>部门id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.specialUsers",
            "description": "<p>特殊选择参与人员</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userId",
            "description": "<p>特殊选择参与人员userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userName",
            "description": "<p>特殊选择参与人员userName</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/questionnaires.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "post",
    "url": "/api/questionnaires/onoff",
    "title": "上架下架",
    "name": "questionnaires_onoff",
    "group": "投票管理",
    "description": "<p>上架下架</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": false,
            "field": "questionnaireIds",
            "description": "<p>投票id表，例如 [1,2,3]</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "onoff",
            "description": "<p>1-上架 2-下架</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/questionnaires.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "get",
    "url": "/api/questionnaires/ques?limit=&page=&status=",
    "title": "我可以参与的投票列表",
    "name": "questionnaires_ques",
    "group": "投票管理",
    "description": "<p>查询我可以参与的投票列表，本接口查询都是上线的投票</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>分页条数，默认10</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>第几页，默认1</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "status",
            "description": "<p>状态，0-未开始 1-进行中 2-已结束,默认为1</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>投票列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>投票总数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>当前页投票列表</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.title",
            "description": "<p>投票投票标题</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.voteCount",
            "description": "<p>当前投票人数</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.rows.top",
            "description": "<p>是否置顶， true置顶 false不置顶</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.startTime",
            "description": "<p>开始时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.endTime",
            "description": "<p>结束时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.onoff",
            "description": "<p>上架下架 0-上架下架未设置 1-已上架 2-已下架</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userId",
            "description": "<p>发起人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userName",
            "description": "<p>发起人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.mobile",
            "description": "<p>发起人手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.createdAt",
            "description": "<p>创建时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.depts",
            "description": "<p>投票范围</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptId",
            "description": "<p>部门id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.specialUsers",
            "description": "<p>特殊选择参与人员</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userId",
            "description": "<p>特殊选择参与人员userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userName",
            "description": "<p>特殊选择参与人员userName</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/questionnaires.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "post",
    "url": "/api/questionnaires/top",
    "title": "置顶操作",
    "name": "questionnaires_top",
    "group": "投票管理",
    "description": "<p>置顶操作</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": false,
            "field": "questionnaireIds",
            "description": "<p>投票id表，例如 [1,2,3]</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "top",
            "description": "<p>false-不置顶 true-置顶, 默认 false 不置顶</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/questionnaires.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "get",
    "url": "/api/votes/comments?limit=&page=&status=questionnaireId",
    "title": "投票评论表",
    "name": "votes_comments",
    "group": "投票管理",
    "description": "<p>投票评论表</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "questionnaireId",
            "description": "<p>问卷投票ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>分页条数，默认10</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>第几页，默认1</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "status",
            "description": "<p>评论状态 0-已提交 1-通过 2-未通过 3-已删除</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>总共评论条数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>当前页评论列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.id",
            "description": "<p>投票结果ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.questionnaireId",
            "description": "<p>投票投票ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userId",
            "description": "<p>投票人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userName",
            "description": "<p>投票人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.mobile",
            "description": "<p>投票人员手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.avatar",
            "description": "<p>投票人头像</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.voteTime",
            "description": "<p>投票时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.checkedIds",
            "description": "<p>投票选择的选项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.comment",
            "description": "<p>评论</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.commentStatus",
            "description": "<p>评论状态 0-已提交(审核中) 1-通过 2-未通过 3-已删除</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/votes.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "post",
    "url": "/api/votes",
    "title": "投票",
    "name": "votes_create",
    "group": "投票管理",
    "description": "<p>投票</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "questionnaireId",
            "description": "<p>投票ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": false,
            "field": "checkedIds",
            "description": "<p>投票选项ID, 示例单选 [1],多选 [1, 2, 3]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "comment",
            "description": "<p>评论</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>投票ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/votes.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "get",
    "url": "/api/votes/info?questionnaireId=",
    "title": "获取投票结果",
    "name": "votes_info",
    "group": "投票管理",
    "description": "<p>获取人员对某一投票的投票结果</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "questionnaireId",
            "description": "<p>投票ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>投票结果数据</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.id",
            "description": "<p>投票结果ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.questionnaireId",
            "description": "<p>投票投票ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userId",
            "description": "<p>投票人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.userName",
            "description": "<p>投票人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.mobile",
            "description": "<p>投票人员手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.avatar",
            "description": "<p>投票人头像</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.voteTime",
            "description": "<p>投票时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.checkedIds",
            "description": "<p>投票选择的选项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.comment",
            "description": "<p>评论</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.commentStatus",
            "description": "<p>评论状态 0-已提交(审核中) 1-通过 2-未通过 3-已删除</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/votes.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "get",
    "url": "/api/votes/options?questionnaireId=",
    "title": "投票结果统计",
    "name": "votes_options_results",
    "group": "投票管理",
    "description": "<p>投票结果统计，显示所有选项参与投票的人员信息统计</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "questionnaireId",
            "description": "<p>问卷投票ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>返回数据</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.ticketCount",
            "description": "<p>总票数</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.personCount",
            "description": "<p>参与投票人数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.options",
            "description": "<p>选项信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.options.option",
            "description": "<p>当前选项信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.option.id",
            "description": "<p>当前选项数据ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.option.questionnaireId",
            "description": "<p>问卷主数据ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.option.sequence",
            "description": "<p>选项排序</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.option.type",
            "description": "<p>选项类型 1-图文类型 2-文字类型</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.option.title",
            "description": "<p>选项标题</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.option.description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.option.image",
            "description": "<p>图片名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.option.video",
            "description": "<p>视屏名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.option.createdAt",
            "description": "<p>创建时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.count",
            "description": "<p>当前选项总票数</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.percent",
            "description": "<p>当前选项投票百分比</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.options.votes",
            "description": "<p>当前选项投票评论列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.votes.id",
            "description": "<p>投票结果ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.votes.questionnaireId",
            "description": "<p>投票投票ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.votes.userId",
            "description": "<p>投票人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.votes.userName",
            "description": "<p>投票人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.votes.mobile",
            "description": "<p>投票人员手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.votes.avatar",
            "description": "<p>投票人头像</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.options.votes.voteTime",
            "description": "<p>投票时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.options.votes.checkedIds",
            "description": "<p>投票选择的选项ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.options.votes.comment",
            "description": "<p>评论</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.options.votes.commentStatus",
            "description": "<p>评论状态 0-已提交(审核中) 1-通过 2-未通过 3-已删除</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/votes.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "get",
    "url": "/api/votes/participate?limit=&page",
    "title": "我参与的投票",
    "name": "votes_participate",
    "group": "投票管理",
    "description": "<p>我参与的投票</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "description": "<p>分页条数，默认10</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "description": "<p>第几页，默认1</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>投票列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>投票总数</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows",
            "description": "<p>当前页投票列表</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.title",
            "description": "<p>投票投票标题</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.rows.voteCount",
            "description": "<p>当前已投票人数</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.description",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.startTime",
            "description": "<p>开始时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.endTime",
            "description": "<p>结束时间</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.onoff",
            "description": "<p>上架下架 0-上架下架未设置 1-已上架 2-已下架</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.rows.currentTime",
            "description": "<p>访问服务器接口的时间记录</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.status",
            "description": "<p>状态，0-未开始 1-进行中 2-已结束， 请注意只有当 onoff=1 表示上架状态当前值才有意义</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userId",
            "description": "<p>发起人userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.userName",
            "description": "<p>发起人姓名</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.mobile",
            "description": "<p>发起人手机</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.createdAt",
            "description": "<p>创建时间</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.deptIds",
            "description": "<p>参与人范围所在部门ID列表，例如[1,2,3], 不传该值则为所有部门人员都可以参与</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "data.rows.specialUserIds",
            "description": "<p>特别选择参与人员userId表，例如 [1, 2, 3]，【注意】此参与人员是专指钉钉单独选择人员参与投票信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.depts",
            "description": "<p>投票范围</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptId",
            "description": "<p>部门id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.rows.specialUsers",
            "description": "<p>特殊选择参与人员</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userId",
            "description": "<p>特殊选择参与人员userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.rows.specialUsers.userName",
            "description": "<p>特殊选择参与人员userName</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/votes.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "post",
    "url": "/api/votes/commentStatus",
    "title": "设置评论状态",
    "name": "votes_set_comentStatus",
    "group": "投票管理",
    "description": "<p>设置评论状态</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>登录token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "voteId",
            "description": "<p>投票ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>状态 1-通过 2-不通过 3-删除</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>{}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/votes.js",
    "groupTitle": "投票管理"
  },
  {
    "type": "get",
    "url": "/api/auth/jsconfig",
    "title": "系统配置",
    "name": "jsconfig",
    "group": "鉴权",
    "description": "<p>系统配置</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>项目列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.corpId",
            "description": "<p>企业corpId</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.corpName",
            "description": "<p>企业名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.agentId",
            "description": "<p>当前应用agentId</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "鉴权"
  },
  {
    "type": "get",
    "url": "/api/auth/login?code=&userId=",
    "title": "用户登录",
    "name": "login",
    "group": "鉴权",
    "description": "<p>用户登录</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>钉钉免登code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userId",
            "description": "<p>测试环境中使用，没有code,携带钉钉用户的userId</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>项目列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.user",
            "description": "<p>钉钉获取当前用户信息</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.userId",
            "description": "<p>用户userId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.userName",
            "description": "<p>用户userName</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.jobnumber",
            "description": "<p>工号</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.avatar",
            "description": "<p>图像</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.mobile",
            "description": "<p>手机</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data.user.depts",
            "description": "<p>部门信息</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.user.depts.deptId",
            "description": "<p>部门deptId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.user.depts.deptName",
            "description": "<p>部门名称</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.token",
            "description": "<p>token信息,需要鉴权的api中请在header中携带此token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "鉴权"
  },
  {
    "type": "get",
    "url": "/api/auth/signature?platform=&url=",
    "title": "签名",
    "name": "signature",
    "group": "鉴权",
    "description": "<p>签名，所有平台公用一个接口，不同的是 platform和url参数不同</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>生成签名的平台, 例如 vote_mobile-投票移动端 vote_pc 投票PC端</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>当前网页的URL，不包含#及其后面部分</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>成功为0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>项目列表</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.corpId",
            "description": "<p>企业corpId</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.agentId",
            "description": "<p>当前应用agentId</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.url",
            "description": "<p>当前页面url</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.timeStamp",
            "description": "<p>时间戳</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.signature",
            "description": "<p>签名</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.nonceStr",
            "description": "<p>随机串</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errcode",
            "description": "<p>失败不为0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "errmsg",
            "description": "<p>错误消息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "鉴权"
  }
] });
