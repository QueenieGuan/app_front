import StateFactory from './state/stateFactory';
import EventType from '../common/eventType';
import StateType from './state/stateType';
import CommandType from '../common/commandType';
import ModelFactory from '../model/modelFactory';
import ModelType from './../model/modelType';
import earthquakeWaveStyle from '../views/style/earthquakeWave.scss';
import echarts from 'echarts/lib/echarts';    //引入 ECharts 主模块
import 'echarts/lib/chart/bar';    //引入柱状图
import 'echarts/lib/chart/pie';    //引入饼图
import 'echarts/lib/chart/radar';   //引入雷达图
import 'echarts/lib/component/title';     //引入标题组件
import 'echarts/lib/component/tooltip';

class Context {
  constructor(controller) {
    this.controller = controller;
    this.currentState = StateFactory.getState(StateType.INIT_STATE);

    this.initialData = {};
    this.currentCity = initialCity;
    this.centerCoor = initCenterCoor;

    this.map = null;
    this._url = '';
    this.gridLayerName = '';
    this.hbLayerName = '';
    this.channelLayerName = '';
    this.timerID = null;
    this.fileName = '';
    this.candidatePosList = [];
    this.excelData = [];
    this.MarkerVector_obj = {
      MarkerVector: [],
      isMarkerZoom: false
    };
    this.circle = [];
    this.reportTabVisiable = false;
    this.currentMapClickCoor = '';
    this.radius = 500;
    this.isStartSelectPoint = false;

    this.city = '';
    this.block = '';
    this.grid = '';
    this.hbGrid = '';
    this.gridSelect = '';
    this.channel = '';
    this.highLightVector = '';
    this.hbHighLightVector = '';
    this.gridIdLayer = '';
    this.hbGridIdLayer = '';
    this.marker = null;
    this.footBar = {
      'init': 0,
      'functionCard': 1,
      'mine': 2
    };

    this.initModel = ModelFactory.createModel(ModelType.INIT);
    this.gridSearchModel = ModelFactory.createModel(ModelType.GRID_SEARCH);
    this.gridSelectModel = ModelFactory.createModel(ModelType.GRID_SELECT_MODEL);
    this.locationSearchModel = ModelFactory.createModel(ModelType.LOCATION_SEARCH_MODEL);
    this.candidateSelectModel = ModelFactory.createModel(ModelType.CANDIDATE_SELECT_MODEL);
    this.hbGridSelectModel = ModelFactory.createModel(ModelType.HBGRID_SELECT_MODEL);
    this.leagueEvaluateModel = ModelFactory.createModel(ModelType.LEAGUE_EVALUATE_MODEL);
    this.businessReportModel = ModelFactory.createModel(ModelType.BUSINESS_REPORT_MODEL);
    // 抛出初始化事件
    this.handleEvent(EventType.CONTEXT_INIT, {});
  }

  /**
   * 切换状态
   * @param state
   */
  switchState(stateType) {
    console.log('CurrentState: ' + stateType);
    const state = StateFactory.getState(stateType);
    this.currentState = state;
  }

  /**
   * 处理事件
   * @param eventType 事件类型
   * @param params    事件参数
   */
  handleEvent(eventType, params) {
    if (this.currentState) {
      this.currentState.handleEvent(this, eventType, params);
    }
  }

  /**
   * 下发指令
   * @param {string} commandType 指令类型
   * @param {object} params      指令参数
   */
  processCommand(commandType, params) {
    this.controller.processCommand(commandType, params);
  }

  /*==============================Init Operation==============================*/
  /**
   * 初始化事件
   * @param {Context} context
   * @param params
   * @private
   */
  contextInit(params) {
    console.log('context init:', params.topView);
    let promise = this.initModel.getInitialData();
    promise.then((data) => {
      params.params.geoserver = data.geoserver;
      params.params.currentCity = this.currentCity;
      params.params.currentFootBarIndex = this.footBar['init'];
      const initPromise = this.processInitialData(data);
      initPromise.then((dataset) => {
        params.params = { ...params.params,
          ...dataset
        };
        this.initialData = params.params;
        console.log(this.initialData, 'initialData');
        this.processCommand(CommandType.TRANSFER_VIEW, {
          params
        });
        this.initMap(this.initialData);
      })
    }).catch((error) => {
      console.log(error, 'error');
    })
  }

  /**
   * 初始化geoserver地图要素
   * @param {Context} context
   * @param params
   * @private
   */
  initGeoserverData = (params) => {
    this._url = params.url;
    // 地图中心点
    this.centerCoor = provinceCenter;
    // 行政区
    this.city = this.initWMSLayer(
      params.url,
      params.layerName01,
      params.style01
    );
    // 区块
    this.block = this.initWMSLayer(
      params.url,
      params.layerName02,
      params.style02
    );
    this.gridLayerName = params.layerName03;
    // 渠道网格
    this.grid = this.initWMSLayer(
      params.url,
      params.layerName03,
      params.style03_1
    );
    this.hbLayerName = params.layerName04;
    // 家宽网格
    this.hbGrid = this.initWMSLayer(
      params.url,
      params.layerName04,
      params.style04_1
    );
    // 筛选网格样式
    this.gridSelect = this.initWMSLayer(
      params.url,
      params.layerName03,
      params.style03_2
    );
    // 筛选网格样式
    this.hbGridSelect = this.initWMSLayer(
      params.url,
      params.layerName04,
      params.style03_2
    );
    this.channelLayerName = params.layerName05;
    // 渠道点
    this.channel = this.initWMSLayer(
      params.url,
      params.layerName05,
      params.style05
    );
    // 网格高亮图层
    this.highLightVector = this.initWMSLayer(
      params.url,
      params.layerName03,
      params.style03_3
    );
    // 家宽网格高亮图层
    this.hbHighLightVector = this.initWMSLayer(
      params.url,
      params.layerName04,
      params.style03_3
    );
    // 渠道网格id图层
    this.gridIdLayer = this.initWMSLayer(
      params.url,
      params.layerName03,
      params.style03_4
    );
    // 家宽网格id图层
    this.hbGridIdLayer = this.initWMSLayer(
      params.url,
      params.layerName04,
      params.style04_2
    );
  }

  /**
   * 初始化地图
   * @param {Context} context
   * @param params
   * @private
   */
  initMap = (params) => {
    this.initGeoserverData(params.geoserver);
    this.map = window.map;
    this.zoomToCenter(this.map, this.centerCoor, 14);
    // this.map = L.map('map').setView(centerCoor, 14);
    // this.map = L.map(document.getElementById('map')).setView(this.centerCoor, 14);
    // // 加载天地图
    // L.tileLayer("https://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}", {}).addTo(this.map);
    // // 加载天地图地名标注
    // L.tileLayer("https://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}", {}).addTo(this.map);
    L.tileLayer("https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}", {}).addTo(this.map);
    // 添加比例尺
    L.control.scale().addTo(this.map);
    this.updateFilterByCity(this.grid, this.currentCity);
    this.map.addLayer(this.grid);
    this.updateFilterByCity(this.city, this.currentCity);
    this.map.addLayer(this.city);
  }

  /**
   * 初始化图层
   * @param {Context} context
   * @param params
   * @private
   */
  initWMSLayer = (url, layerName, style) => {
    return L.tileLayer.wms(url, {
      layers: layerName,
      styles: style,
      format: 'image/png',
      transparent: true,
      version: '1.1.1'
    });
  }

  /**
   * 初始化数据
   * @param {Context} context
   * @param params
   * @private
   */
  processInitialData = (data) => {
    return new Promise((resolve) => {
      const params = {
        cities: ['广东省'],
        regions: [],
        blocks: [],
        dichType: [],
        direction: [],
        cityInfoList: [],
      };
      let id = 0;
      data.city.forEach((city) => {
        params.cities.push(city.region);
        let info = {
          city: city.region,
          id: city.id,
          centerCoor: [city.gpsLat, city.gpsLon],
        }
        params.cityInfoList.push(info);
        if (city.region === this.currentCity) {
          id = city.id;
        }
      })

      data.lbl_aim.forEach((aim) => {
        let lblAim = {
          value: aim.name,
          label: aim.name
        };
        params.dichType.push(lblAim);
      });

      data.lbl_type.forEach((type) => {
        let lblType = {
          value: type.name,
          label: type.name
        };
        params.direction.push(lblType);
      });

      params.isPortCover = ['是', '否'];
      params.returnNums = [5, 10, 15, 20];
      // 获取当前地市行政区和区块
      const promise = this.initModel.getRegionsOfCity(this.currentCity, id);
      promise.then((data) => {
        data.data.data.region.forEach((region) => {
          params.regions.push(region.region);
        })
        params.blocks = data.data.data.block;
        resolve(params);
      });
    })
  }

  /*==============================地市切换==============================*/

  /**
   * 切换地市
   * @param {Context} context
   * @param params
   * @private
   */
  changeCity = (targetCity) => {
    let city = '';
    if (targetCity == "广东省") {
      city = "";
      this.centerCoor = provinceCenter;
    } else {
      city = targetCity;
      for (let city of this.initialData.cityInfoList) {
        if (city.city === targetCity) {
          this.centerCoor = city.centerCoor;
          break;
        }
      }
    }
    this.currentCity = city;
    this.zoomToCenter(this.map, this.centerCoor, 14);
    this.updateFilterByCity(this.city, city);
    this.updateFilterByCity(this.block, city);
    this.updateFilterByCity(this.hbGrid, city);
    this.updateFilterByCity(this.grid, city);
    this.updateFilterByCity(this.channel, city);
  }

  /*==============================图层切换==============================*/

  /**
   * 切换图层
   * @param {Context} context
   * @param params
   * @private
   */
  changeLayers(params) {
    this.map.removeLayer(this.city);
    this.map.removeLayer(this.block);
    this.map.removeLayer(this.channel);
    this.map.removeLayer(this.grid);
    this.map.removeLayer(this.hbGrid);
    params.forEach((layer) => {
      switch(layer) {
        case "行政区图层":
            if (this.currentCity == "广东省") {
              this.updateFilterByCity(this.city, "");
            } else {
              this.updateFilterByCity(this.city, this.currentCity);
            }
            this.map.addLayer(this.city);
            break;
          case "区块图层":
            if (this.currentCity == "广东省") {
              this.updateFilterByCity(this.block, "");
            } else {
              this.updateFilterByCity(this.block, this.currentCity);
            }
            this.map.addLayer(this.block);
            break;
          case "渠道点图层":
            if (this.currentCity == "广东省") {
              this.updateFilterByCity(this.channel, "");
            } else {
              this.updateFilterByCity(
                this.channel,
                this.currentCity
              );
            }
            this.map.addLayer(this.channel);
            break;
          case "渠道网格图层":
            if (this.currentCity == "广东省") {
              this.updateFilterByCity(this.grid, "");
            } else {
              this.updateFilterByCity(this.grid, this.currentCity);
            }
            this.map.addLayer(this.grid);
            break;
          case "家宽网格图层":
            if (this.currentCity == "广东省") {
              this.updateFilterByCity(this.hbGrid, "");
            } else {
              this.updateFilterByCity(
                this.hbGrid,
                this.currentCity
              );
            }
            this.map.addLayer(this.hbGrid);
            break;
      }
    })
  }

  /*==============================根据id高亮显示网格==============================*/

  /**
   * 显示点击要素极其详细信息并高亮显示
   * @param {Context} context
   * @param params
   * @private
   */
  showFeatureInfo = (params) => {
    console.log(params, 'params');
    let gridName = '';
    switch(params.layer) {
      case 'grid':
        gridName = this.gridLayerName;
        break;
      case 'hbGrid':
        gridName = this.hbLayerName;
        break;
      default:
        break;
    }
    const evt = params.evt;
    // const _this = this;
    L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
      getFeatureInfoUrl: function (latlng, map, layers) {
        const size = map.getSize();
        const point = map.latLngToContainerPoint(latlng, map.getZoom());
        const params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          styles: '',
          transparent: 1,
          version: 1.1,
          format: 'image/png',
          bbox: map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          layers: layers,
          query_layers: layers,
          info_format: 'text/xml'
        };

        params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
        params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

        return this._url + L.Util.getParamString(params, this._url, true);
      },
    });
    const url = new L.TileLayer.BetterWMS(this._url, {}).getFeatureInfoUrl(evt.latlng, this.map, gridName);
    this.initModel.getFeatureInfo(url, 1)
    .then((res) => {
      console.log(res, 'clicked feeature info');
      this.map.removeLayer(this.highLightVector);
      this.updateFilterById(res.data.data[0].gridId, this.highLightVector);
      this.map.addLayer(this.highLightVector);
    })
  }

    /**
   * 清除所选网格
   * @param {Context} context
   * @param params
   * @private
   */
  clearSelectedGrid = () => {
    this.map.removeLayer(this.highLightVector);
    this.zoomToCenter(this.map, this.centerCoor, 14);
  }

  /*==============================地址搜索==============================*/

  /**
   * 根据关键字搜索地点
   * @param {Context} context
   * @param {string} keywords 
   */
  searchLocation(keywords) {
    if(this.timerID){  // 如果timerID不为空，清空timerID
      clearInterval(this.timerID);
      this.timerID = null;
    }
    this.timerID=setTimeout(() => {
      this.locationSearchModel.searchLocationByKeywords(keywords);
    }, 1000);
  }

  /**
   * 逐次获取地址数据，实现懒加载
   * @param {Context} context
   */
  getLocationData() {
    this.locationSearchModel.getData();
  }

  /**
   * 点击展示选中的地址
   * @param {Context} context
   * @param {array} coor
   */
  showLocationPos(coor) {
    this.drawSingleMarker(coor);
    this.zoomToCenter(this.map, coor, 14);
  }

  /*==============================表格上传与下载==============================*/

  /**
   * 下载表格
   * @param {Context} context
   */
  downLoadTemplate() {
    window.location.href = hosts + "downLoad.action";
  }

  /**
   * 上传表格
   * @param {Context} context
   * @param {object} file
   */
  uploadFile(file) {
    let excelData = [];
    this.fnReadJSON(file)
    .then((data) => {
      excelData = data;
      // 读取表格数据，判断数据是否完整
      for(let i = 0; i < excelData.length; i++) {
        let rowData = excelData[i];
        if (!rowData["备租点地址"] || !rowData["经度"] || !rowData["纬度"] || !rowData["位置"] || !rowData["楼层"] ||
          !rowData["租金总额"] || !rowData["租金单价"] || !rowData["坐标类型"] || !rowData["选址导向"] || !rowData["选址范围"]) {
            this.notify("表格存在缺失数据，请重传");
          return false;
        }
      }
      if (excelData.length === 0) {
        this.notify("请传入表格");
        return false;
      } else{
        // 向后台发送文件上传请求
        this.candidateSelectModel.getFileName(file)
        .then((fileName) => {
          this.fileName = fileName;
          this.notify('文件上传成功');
        })
        .catch((error) => {
          this.notify('文件上传失败');
          console.log(error);
        })
      }
    })
  }

  /**
   * 读取表格内容
   * @param {Context} context
   * @param {object} files
   */
  fnReadJSON(files) {
    let excelData = [];
    var fileReader = new FileReader();
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files);
    return new Promise((resolve) => {
      fileReader.onload = ev => {
        try {
          var data = ev.target.result;
          var workbook = XLSX.read(data, {
            type: "binary"
          });
        } catch (e) {
          console.log(e);
          this.notify("文件类型不正确");
          return;
        }
  
        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = "";
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            fromTo = workbook.Sheets[sheet]["!ref"];
            excelData = excelData.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            );
            excelData.forEach((data, index) => {
              data.ID = index;
            });
            // 删除数组中的前两个元素，也即删除表格的前两行
            excelData.splice(0, 2);
            resolve(excelData);
          }
        }
      };
    })
  }

  /**
   * 清除文件名
   * @param {Context} context
   */
  clearFileName = () => {
    this.fileName = '';
  }

  /*==============================(渠道)网格选址==============================*/

  /**
   * 根据条件筛选网格
   * @param {Context} context
   * @param params
   * @private
   */
  selectGrids = (params) => {
    this.showLoading(true);
    this.changeTab({topView: 'gridSelect', params: this.initialData});
    const parameters = { ...params,
      city: this.currentCity
    };
    const promise = this.gridSelectModel.getSelectGrids(parameters);
    promise.then((data) => {
      const idList = [];
      data.boxList.forEach((grid) => {
        idList.push(grid.gridId);
      });
      this.map.removeLayer(this.grid);
      this.zoomToCenter(this.map, [data.boxList[0].cLat, data.boxList[0].cLong], 12);
      this.updateFilterById(idList, this.gridSelect);
      this.map.addLayer(this.gridSelect);
      this.showLoading(false);
      this.changeTab({
        topView: 'init',
        params: {}
      });
    }).catch((error) => {
      this.showLoading(false);
      this.changeTab({ topView: 'gridSelect', params: this.initialData });
      this.notify(error);
    })
  }

  /**
   * 退出按条件筛选网格
   * @param {Context} context
   * @param params
   * @private
   */
  exitSelectGrids = () => {
    this.map.removeLayer(this.gridSelect);
    this.map.addLayer(this.grid);
    this.map.addLayer(this.city);
    this.zoomToCenter(this.map, this.centerCoor, 14);
    this.map.removeLayer(this.highLightVector);
    const data = this.initialData;
    // 控制featureCard、退出按钮、展示按钮不可显示
    data.expandBtnVisiable = false;
    data.featureTableVisiable = false;
    data.exitBtnVisiable = false;
    this.changeTab({ topView: 'functionCard', params: data })
  }

    /**
   * 缩放至指定渠道网格并高亮显示
   * @param {Context} context
   * @param params
   * @private
   */
  zoomToGrid = (gridId) => {
    this.updateFilterById(gridId, this.highLightVector);
    this.map.addLayer(this.highLightVector);
    let promise = this.gridSearchModel.getGridCenter(gridId);
    promise.then((res) => {
      const center = [res.data.data.list[0].cLat, res.data.data.list[0].cLong];
      this.zoomToCenter(this.map, center, 14);
    }).catch((error) => {
      console.log(error, 'promise error');
    })
  }

    /**
   * 逐页获取网格数据
   * @param {Context} context
   * @param {number} currentPage
   * @param {number} pageSize
   */
  getGridDataByPage(currentPage, pageSize) {
    this.gridSelectModel.getData(currentPage, pageSize);
  }

  /*==============================候选点打分==============================*/

  /**
   * 展示候选点打分结果
   * @param {Context} context
   * @param {object} params
   */
  showCandidateList(params) {
    this.showLoading(true);
    this.changeTab({topView: 'candidateSelect', params: this.initialData});
    const parameters = { ...params,
      city: this.currentCity
    };
    const coorList = [];
    if (this.fileName === '') {
      this.notify('请先上传文件，再执行创建操作');
      return;
    } else {
      this.candidateSelectModel.getCandidateList(parameters, this.fileName)
      .then((res) => {
        res.data.data.candidateList.forEach((point) => {
          const coor = [point.gpsLat, point.gpsLon];
          coorList.push(coor);
        });
        this.map.removeLayer(this.grid);
        this.drawMarkers(coorList, this.candidatePosList);
        // this.drawEarthquakeWave(coorList);
        this.zoomToCenter(this.map, coorList[0], 8);
        this.showLoading(false);
        this.changeTab({
          topView: 'init',
          params: {}
        });
        this.fileName = '';
      })
      .catch((error) => {
        this.showLoading(false);
        this.changeTab({ topView: 'candidateSelect', params: this.initialData });
        this.notify('创建失败');
        console.log(error);
      })
    }    
  }

  /**
   * 根据坐标数组批量绘制marker
   * @param {Context} context
   * @param {array} coorList
   * @param {array} pageSize
   */
  drawMarkers(coorList, candidatePosList) {
    if(this.candidatePosList.length > 0) {
      this.candidatePosList.forEach((layer) => {
        this.map.removeLayer(layer);
      })
    }
    coorList.forEach((coor, index) => {
      const coordinate = {'lat': coor[0], 'lon': coor[1]};
      const poi = L.icon({
        iconUrl: '../../dist/blue_point.png',
        iconSize: [35, 35],
        iconAnchor: [20, 10],
      });
      candidatePosList[index] = L.marker(coordinate, {
        icon: poi,
        bounceOnAdd: true,
      });
      this.map.addLayer(candidatePosList[index]);
    })
  }

  /**
   * 根据单个坐标绘制marker
   * @param {Context} context
   * @param {array} coor
   */
  drawSingleMarker(coor) {
    if(this.marker !== null) {
      this.map.removeLayer(this.marker);
    }
    const coordinate = {'lat': coor[0], 'lon': coor[1]};
    const poi = L.icon({
      iconUrl: '../../dist/red_point.png',
      iconSize: [35, 35],
      iconAnchor: [20, 10],
    });
    this.marker = L.marker(coordinate, {
      icon: poi,
      bounceOnAdd: true,
    });
    this.map.addLayer(this.marker);
  }

  /**
   * 移除单个坐标绘制的marker
   * @param {Context} context
   */
  removeMarker() {
    this.map.removeLayer(this.marker);
    this.zoomToCenter(this.map, this.centerCoor, 14);
  }

  /**
   * 根据坐标缩放至选中候选点
   * @param {Context} context
   * @param {number} rank
   */
  zoomToSelectedCandidatePos(coor) {
    this.drawSingleMarker(coor);
    this.zoomToCenter(this.map, coor, 14);
  }

  /**
   * 逐页获取候选点数据
   * @param {Context} context
   * @param {number} currentPage
   * @param {number} pageSize
   */
  getCandidateDataByPage(currentPage, pageSize) {
    this.candidateSelectModel.getData(currentPage, pageSize);
  }

  /**
   * 绘制地震波效果的点
   * @param {Context} context
   * @param {Array} coorList (必须为数组结构)
   */
  drawEarthquakeWave = (coorList) => {
    const earthquakeWave = L.divIcon({className: earthquakeWaveStyle.gradient});
    coorList.forEach((coordinate, i) => {
      this.MarkerVector_obj.MarkerVector[i] = L.marker(coordinate, {icon: earthquakeWave});
      this.map.addLayer(this.MarkerVector_obj.MarkerVector[i]);
    });
    this.zoomToCenter(this.map, coorList[0], 14);
  }

  /*==============================家宽选址==============================*/

  /**
   * 根据条件筛选家宽网格
   * @param {Context} context
   * @param params
   * @private
   */
  selectHBGrids = (params) => {
    this.showLoading(true);
    this.changeTab({topView: 'hbGridSelect', params: this.initialData});
    const parameters = { ...params,
      city: this.currentCity
    };
    const promise = this.hbGridSelectModel.getSelectHBGrids(parameters);
    promise.then((data) => {
      const idList = [];
      data.boxList.forEach((hbGrid) => {
        idList.push(hbGrid.gridId);
      });
      this.map.removeLayer(this.grid);
      this.zoomToCenter(this.map, [data.boxList[0].cLat, data.boxList[0].cLong], 12);
      this.updateFilterById(idList, this.hbGridSelect);
      this.map.addLayer(this.hbGridSelect);
      this.showLoading(false);
      this.changeTab({
        topView: 'init',
        params: {}
      });
    }).catch((error) => {
      this.showLoading(false);
      this.changeTab({ topView: 'hbGridSelect', params: this.initialData });
      this.notify('家宽网格创建失败，请重试！');
    })
  }

  /**
   * 退出按条件筛选家宽网格
   * @param {Context} context
   * @param params
   * @private
   */
  exitSelectHBGrids = () => {
    this.map.removeLayer(this.hbGridSelect);
    this.map.addLayer(this.grid);
    this.map.addLayer(this.city);
    this.zoomToCenter(this.map, this.centerCoor, 14);
    this.map.removeLayer(this.highLightVector);
    const data = this.initialData;
    // 控制featureCard、退出按钮、展示按钮不可显示
    data.expandBtnVisiable = false;
    data.featureTableVisiable = false;
    data.exitBtnVisiable = false;
    this.changeTab({ topView: 'functionCard', params: data })
  }

  /**
   * 缩放至指定家宽网格并高亮显示
   * @param {Context} context
   * @param params
   * @private
   */
  zoomToHBGrid = (gridId) => {
    this.updateFilterById(gridId, this.hbHighLightVector);
    this.map.addLayer(this.hbHighLightVector);
    let promise = this.gridSearchModel.getGridCenter(gridId);
    promise.then((res) => {
      const center = [res.data.data.list[0].cLat, res.data.data.list[0].cLong];
      this.zoomToCenter(this.map, center, 14);
    }).catch((error) => {
      console.log(error, 'promise error');
    })
  }

  /**
   * 逐页获取家宽网格数据
   * @param {Context} context
   * @param {number} currentPage
   * @param {number} pageSize
   */
  getHBGridsDataByPage(currentPage, pageSize) {
    this.hbGridSelectModel.getData(currentPage, pageSize);
  }

  /*==============================加盟厅评估==============================*/

  /**
   * 展示加盟厅选址结果
   * @param {Context} context
   * @param params
   * @private
   */
  showLeagueEvaluteList = (params) => {
    this.showLoading(true);
    this.changeTab({ topView: 'leagueEvaluate', params: this.initialData });
    const parameters = { ...params,
      city: this.currentCity
    };
    if (this.fileName === '') {
      this.notify('请先上传文件，再执行创建操作');
      return;
    } else {
      this.leagueEvaluateModel.getLeagueEvaluateList(parameters, this.fileName)
      .then((res) => {
        
        res.data.data.candidateList.forEach((item, i) => {
          let color = "";
          let opacity = 0;
          if (item.cddscore < 3) {
            color = channelConfig[0].color;
            opacity = channelConfig[0].opacity;
          } else if (item.cddscore >= 3 && item.cddscore < 12) {
            color = channelConfig[1].color;
            opacity = channelConfig[1].opacity;
          } else if (item.cddscore >= 12 && item.cddscore < 28) {
            color = channelConfig[2].color;
            opacity = channelConfig[2].opacity;
          } else if (item.cddscore >= 28 && item.cddscore < 48) {
            color = channelConfig[3].color;
            opacity = channelConfig[3].opacity;
          } else if (item.cddscore >= 48) {
            color = channelConfig[4].color;
            opacity = channelConfig[4].opacity;
          }
          this.drawRectangle(this.map, this.MarkerVector_obj, [item.gdLon, item.gdLat], item.size / 1000, i, color, opacity, item.addr);
        });
        this.map.removeLayer(this.grid);
        const coordinate = [res.data.data.candidateList[0].gdLat, res.data.data.candidateList[0].gdLon];
        this.zoomToCenter(this.map, coordinate, 10);
        this.showLoading(false);
        this.changeTab({
          topView: 'init',
          params: {}
        });
        this.fileName = '';
      })
      .catch((error) => {
        this.showLoading(false);
        this.changeTab({ topView: 'leagueEvaluate', params: this.initialData });
        this.notify('加盟厅创建失败');
        console.log(error);
      })
    }
  }

  /**
   * 退出加盟厅评估，清空加盟厅要素，回到原位
   * @param {Context} context
   * @param params
   * @private
   */
  exitLeagueEvaluate = () => {
    if (this.MarkerVector_obj.MarkerVector.length > 0) {
      this.MarkerVector_obj.MarkerVector.forEach((marker) => {
        this.map.removeLayer(marker);
      })
      this.MarkerVector_obj.MarkerVector = [];
    }
    this.map.addLayer(this.grid);
    this.zoomToCenter(this.map, this.centerCoor, 14);
    const data = this.initialData;
    // 控制featureCard、退出按钮、展示按钮不可显示
    data.expandBtnVisiable = false;
    data.featureTableVisiable = false;
    data.exitBtnVisiable = false;
    this.changeTab({ topView: 'functionCard', params: data })
  }

  /**
   * 根据坐标缩放至选中加盟厅
   * @param {Context} context
   * @param {number} rank
   */
  zoomToSelectedLeagueEvaluatePos(coor) {
    this.zoomToCenter(this.map, coor, 14);
  }

  /**
   * 逐页获取加盟厅数据
   * @param {Context} context
   * @param {number} currentPage
   * @param {number} pageSize
   */
  getLeagueEvaluateDataByPage(currentPage, pageSize) {
    this.leagueEvaluateModel.getData(currentPage, pageSize);
  }

  /**
   * 绘制矩形
   * @param {Context} context
   * @param params
   * @private
   */
  drawRectangle(map, MarkerVector_obj, coor, length, i, color, opacity, text) {
    let distance = lengthParams[length - 1];
    let minX = coor[0] - distance.longtitudeParams;
    let minY = coor[1] - distance.latitudeParams;
    let maxX = coor[0] + distance.longtitudeParams;
    let maxY = coor[1] + distance.latitudeParams;
    const bounds = [[minY, minX], [maxY, maxX]];
    MarkerVector_obj.MarkerVector[i] = L.rectangle(bounds, { color: color, weight: 1 });
    map.addLayer(MarkerVector_obj.MarkerVector[i]);
  }

  /*==============================商业报告==============================*/

  startSelectPoint() {
    this.isStartSelectPoint = true;
    
  }

  /**
   * 点击地图作圆
   * @param {Context} context
   * @param coor
   * @private
   */
  setCurrentMapClickCoor(coor) {
    this.currentMapClickCoor = coor;
    if (this.circle.length > 0) {
      this.map.removeLayer(this.circle[0]);
      this.circle = [];
    }
    this.drawCircle(this.map, this.circle, this.currentMapClickCoor, this.radius);
  }

  /**
   * 点击地图作圆
   * @param {Context} context
   * @param radius
   * @private
   */
  radiusChange(radius) {
    this.radius = radius;
    if (this.circle.length > 0) {
      this.map.removeLayer(this.circle[0]);
      this.circle = [];
    }
    this.drawCircle(this.map, this.circle, this.currentMapClickCoor, this.radius);
  }

  /**
   * 绘制圆形
   * @param {Context} context
   * @param map
   * @param {array} circle
   * @param evt
   * @param radius
   * @private
   */
  drawCircle(map, circle, evt, radius) {
    if (!this.isStartSelectPoint) {
      return false;
    }
    circle[0] = L.circle(evt.latlng, {
      color: '#97FFFF',
      fillColor: 'rgb(137,207,240)',
      fillOpacity: 0.5,
      radius: radius  //圆的半径(单位：米)
    });
    map.addLayer(circle[0]);
  }

  /**
   * 退出商业报告
   * @param {Context} context
   * @private
   */
  exitReport() {
    // 清除圆
    if (this.circle.length > 0) {
      this.map.removeLayer(this.circle[0]);
      this.circle = [];
    }
    // 隐藏展开按钮
    this.initialData.expandBtnVisiable = false;
    // 隐藏退出按钮
    this.initialData.exitBtnVisiable = false;
    // 隐藏商业报告框
    this.showReportTab(false);
    // 地图回到原点
    this.zoomToCenter(this.map, this.centerCoor, 14);
  }

  /**
   * 显示商业报告Tab
   * @param {Context} context
   * @param {boolean} bool 
   */
  showReportTab(bool) {
    this.reportTabVisiable = bool;
    if (this.initialData.reportTabVisiable === undefined) {
      this.initialData = { ...this.initialData, reportTabVisiable: this.reportTabVisiable };
    } else {
      this.initialData.reportTabVisiable = this.reportTabVisiable;
      this.changeTab({ topView: 'init', params: this.initialData });
    }   
  }

  /**
   * 创建商业报告
   * @param {Context} context
   * @param {boolean} bool 
   */
  createReport(params) {
    // 判断是否已在地图上选点
    if (this.currentMapClickCoor === '') {
      this.notify('请先在地图上选点！');
      return false;
    }
    this.showLoading(true);
    this.changeTab({ topView: 'report', params: this.initialData });
    const parameters = {
      size: this.radius,
      lat: this.currentMapClickCoor.latlng.lat,
      lng: this.currentMapClickCoor.latlng.lng,
      city: this.currentCity,
      lbl_type: params.ditchType,
      lbl_aim: params.direction
    };
    this.businessReportModel.getReportData(parameters)
    .then((data) => {
      this.showLoading(false);
      this.initialData.type = parameters.lbl_type;   //选址类型
      this.initialData.aim = parameters.lbl_aim;     //选址目的
      this.initialData.score = data.data.data.candidate.cddscore; //选址得分
      let myDate = new Date();
      this.initialData.date = myDate.getFullYear()+'年'+(myDate.getMonth()+1)+'月'+myDate.getDate()+'日'; //创建时间

      this.changeTab({ topView: 'report', params: this.initialData }); 
      this.radarOf5D(data);     //五大维度分析
      this.barOfBcoe(data);     //商圈生态
      this.barOfBreq(data);     //业务需求
      this.barOfCitd(data);     //竞争分布
      this.barOfTraf(data);     //交通便利
      this.pieOfCusval(data);   //客户价值
      
    })
    .catch(() => {
      this.showLoading(false);
      this.changeTab({ topView: 'report', params: this.initialData });
      this.notify('商业报告加载失败，请重试！');
    })
  }

  /*==========================商业报告-五大维度分析方法===========================*/
  radarOf5D(data){
    let breqSc = data.data.data.candidate.breqSc;
    let trafSc = data.data.data.candidate.trafSc;
    let cusvalSc = data.data.data.candidate.cusvalSc;
    let citdSc= data.data.data.candidate.citdSc;
    let bcoeSc =  data.data.data.candidate.bcoeSc;
    
    let radarData = [breqSc,trafSc,cusvalSc,citdSc,bcoeSc];
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('radarOf5D'));
    let textColor ='rgba(222,226,209,1)';
    let fontsize = 18;
    let radarIndicator =  [
      {text :'业务需求 '+breqSc,max:100},
      {text : '交通便利\n'+trafSc,max:100},
      {text : '客户价值 '+cusvalSc,max:100},
      {text : '竞争分布'+citdSc,max:100},
      {text : '商圈生态\n'+bcoeSc,max:100}
    ];
    let areaColor = ['rgba(114, 172, 209, 0.2)',
                     'rgba(114, 172, 209, 0.4)', 
                     'rgba(114, 172, 209, 0.6)',
                     'rgba(114, 172, 209, 0.8)', 
                     'rgba(114, 172, 209, 1)'
    ];
    let radarLineColor = 'rgba(255, 255, 255, 0.5)';
    // 绘制图表
    myChart.setOption({
      animation: false,  //一定要设置为false，不然xdoc收到的图片是空的
      color: ['#3398DB'],
      title: {
        text:'五大维度分析',
        textStyle: {
          color: '#f5f4e8',
          fontSize: 18,
        }
      },
      tooltip : {
          trigger: 'axis'
      },
      calculable : true,
      radar : [{
        indicator :radarIndicator,
        center: ['50%', '55%'],
        radius: 95,
        startAngle: 90,
        splitNumber: 4,
        shape: 'circle',
        name: {
          formatter:'{value}',
          fontSize: 12,
          textStyle: {
              color:textColor
          }
        },
        splitArea: {
          areaStyle: {
              color: areaColor,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 10
          }
        },
        axisLine: {
          lineStyle: {
              color: radarLineColor
          }
        },
        splitLine: {
          lineStyle: {
              color: radarLineColor
          }
        }
      }],
      series : [{
        name: '五大维度分析',
        type: 'radar',
        itemStyle: {
          normal: {
            areaStyle: {type: 'default'},
            color: '#48D1CC',
            borderColor: '#5ac3bd',
            shadowColor:'rgba(0,0,0,0.5)'
          }
        },
        data : [{
            value : radarData,
            name : '得分',
        }]
      }]
    });
  }

  /*==========================商业报告-商圈生态方法===========================*/
  barOfBcoe(data) {
    //console.log('data.data.candidate',data.data.data.candidate)
    let supmrk = data.data.data.candidate.supmrk;
    let youeryuan = data.data.data.candidate.youeryuan 
    let seniorEdu = data.data.data.candidate.seniorEdu;
    let lifeServ = data.data.data.candidate.lifeServ; 
    let bankPot = data.data.data.candidate.bankPot;
    let logistics = data.data.data.candidate.logistics;
    let generHosp = data.data.data.candidate.generHosp;
    let specHosp = data.data.data.candidate.specHosp;
    let cutStore = data.data.data.candidate.cutStore;
    let industPark = data.data.data.candidate.industPark; 
    let intergMark = data.data.data.candidate.intergMark; 
    let goverArea = data.data.data.candidate.goverArea;
    let othStore = data.data.data.candidate.othStore;
    let busiBuild = data.data.data.candidate.busiBuild;
    let company = data.data.data.candidate.company; 
    let hEtric = data.data.data.candidate.hEtric; 

    let textColor = 'rgba(222,226,209,1)'; 
    let barColor = ['#00feff', '#027eff', '#0286ff'];
    let fontsize = 13;
    let shengtai = {
      "kind": {
        "大型商超":supmrk,
        "幼儿园":youeryuan,
        "高等院校/成人教育/职校":seniorEdu,
        "生活服务":lifeServ,
        "银行":bankPot,
        "物流服务":logistics,
        "综合医院":generHosp,
        "专科医院":specHosp,
        "文化用品店":cutStore,
        "产业园区/工厂":industPark,
        "综合市场":intergMark,
        "政府机关及事业单位":goverArea,
        "其他专卖场":othStore,
        "工业大厦/商务楼宇":busiBuild,
        "公司企业":company,
        "家电电子卖场":hEtric
      }
    };
    let myChart = echarts.init(document.getElementById('barOfBcoe'))

    myChart.setOption ({
      animation: false,
      title: {
        text:'商圈生态',
        textStyle: {
          color: '#f5f4e8',
          fontSize: 18,
        }
      },
      grid:{
          top:'10%',
          left:'28%',
          bottom:'15%',
      },
      xAxis: [
        {
          type: 'value',
          name:'数目（个）',
          nameLocation:'center',
          nameGap:25,
          nameTextStyle:{
              color:textColor,
              fontSize: 0.7*fontsize,     
          },
          max: shengtai.all,
          splitLine: {
              show: false
          },
          axisLine:{
              lineStyle:{
                  color:textColor,
              }
          },
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: Object.keys(shengtai.kind),
          axisLabel: {    
              rotate: 20,
              //padding: [0, 10, 0, 0],
              textStyle: {
                color: textColor,
                fontSize: 0.6*fontsize
              }
          },
          axisTick:{
              alignWithLabel:'true'
          },
          splitLine: {
              show: false
          },
          axisLine:{
              lineStyle:{
                  color:textColor,
              }
          }
        }
      ],
      series: [
        {
          type: 'bar',
          stack: 'chart',
          z: 3,
          label: {
            normal: {
              position: 'right',
              show: true,
              color: textColor
            }
          },
          data: Object.keys(shengtai.kind).map(function (key) {
              return shengtai.kind[key];
            }
          ),
          barWidth: 12,
          itemStyle: { 
            normal: {
              barBorderRadius: 5,
              color:  new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: barColor[0]
                  },
                  {
                      offset: 0.5,
                      color: barColor[1]
                  },
                  {
                      offset: 1,
                      color: barColor[2]
                  }]
              ),
            }
          }
        } 
      ]
    });
  }

  /*==========================商业报告-业务需求方法===========================*/
  barOfBreq(data){
    let a1824C = data.data.data.candidate.a1824C;
    let a2530C = data.data.data.candidate.a2530C;
    let a3140C = data.data.data.candidate.a3140C;
    let a4150C = data.data.data.candidate.a4150C;
    let a51100C = data.data.data.candidate.a51100C;

    let ngA4150C = data.data.data.candidate.ngA4150C;
    let ngA51100C = data.data.data.candidate.ngA51100C;

    let liveNumberSum = a1824C+a2530C+a3140C+a4150C+a51100C;
    let workNumberSum = ngA4150C+ngA51100C;

    let workNumber = [
      {name:'18-24岁',value:a1824C*100},
      {name:'25-30岁',value:a2530C*100},
      {name:'31-40岁',value:a3140C*100},
      {name:'41-50岁',value:a4150C*100},
      {name:'50-100岁',value:a51100C*100},
    ];
    let liveNumber= [
      {name:'41-50岁',value:ngA4150C*100},
      {name:'50-100岁',value:ngA51100C*100},
    ];
    let sumNumberPie =  [
      {name:'工作地人口',value:Math.round(liveNumberSum/(liveNumberSum+workNumberSum)*100)},
      {name:'居住地人口',value:Math.round(workNumberSum/(liveNumberSum+workNumberSum)*100)}
    ];

    let myChart = echarts.init(document.getElementById('barOfBreq'));
    let textColor = 'rgba(222,226,209,1)';
    let fontsize = 14;
    let sumpieColor = ['#368cbf','#41924B'];
    let agepieColor = ['#0000A1','#1F6ED4','#39BAE8','#316194', '#003399' ];
    let pielabel = {
        color:textColor,
        fontSize:0.8*fontsize, 
        formatter:'{b}\n\n{c}%' ,
        position: 'inner',
        textStyle: {fontSize:0.8*fontsize}  //echarts2
    };

    myChart.setOption({
      animation: false,  //一定要设置为false，不然xdoc收到的图片是空的 
      title: [
        {
          text:'业务需求',
          textStyle: {
            color: '#f5f4e8',
            fontSize: 18,
          },
        },
        {
          text: '工作地人口年龄占比',
          left:'2%',
          top:'45%', 
          textStyle:{
            color:'rgba(234,227,227,0.8)',
            fontSize: 14,
          },
        },
        {
          text:'居住地人口年龄占比',
          left: '56%',
          top:'45%',
          textStyle:{
            color:'rgba(234,227,227,0.8)',
            fontSize: 14,
          },
        }
      ], 
      series:[
        {                
          type: 'pie',
          name:'人口分布比',
          center: ['50%', '25%'],
          radius: ['15%','40%'],
          data: sumNumberPie,
          color: sumpieColor,
          label: pielabel,   //echarts3
          itemStyle:{normal:{label:pielabel}},    //echarts2
        },
        {
          name: '工作地人口年龄占比',
          type: 'pie',
          center: ['29%', '74%'],
          radius: ['15%','40%'],
          data:  workNumber,
          color: agepieColor,
          label: pielabel,   //echarts3
          itemStyle:{normal:{label:pielabel}},    //echarts2
        },
        {
          name: '居住地人口年龄占比',
          type: 'pie',
          center: ['75%', '74%'],
          radius: ['15%','40%'],
          data: liveNumber,
          color: agepieColor,
          label: pielabel,   //echarts3
          itemStyle:{normal:{label:pielabel}},    //echarts2
        }
      ]
    });
  }

  /*==========================商业报告-竞争分布方法===========================*/
  barOfCitd(data){
    let zyqd = data.data.data.candidate.zyqd;
    let shqd = data.data.data.candidate.shqd;
    let vieShqdZyqd = data.data.data.candidate.vieShqdZyqd;
    let dianxinyyt = data.data.data.candidate.dianxinyyt;
    let liantyyt = data.data.data.candidate.liantyyt;
    let yidongyyt = data.data.data.candidate.yidongyyt;
   
    let bardata = [zyqd, shqd, vieShqdZyqd];
    let pieData = [
      {name: '移动营业厅', value: yidongyyt},
      {name: '联通营业厅', value: liantyyt},
      {name: '电信营业厅', value: dianxinyyt}
    ];
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('barOfCitd'));
    let textColor = 'rgba(222,226,209,1)';
    let fontsize = 16;    
    let barColor = ['#00feff', '#027eff', '#0286ff'];
    let piecolor = ['#316194', '#00ad4e', '#003399'];
    let pielabel = {
      color:textColor,
      fontSize:fontsize, 
      formatter:'{b}\n\n{c}' ,
      position: 'inner',
      textStyle: {fontSize:0.8*fontsize}  //echarts2
    }
    
    // 绘制图表
    myChart.setOption({
      animation: false,  //一定要设置为false，不然xdoc收到的图片是空的
      title: {
        text:'竞争分布',
        textStyle: {
          color: '#f5f4e8',
          fontSize: 18,
        }
      }, 
      grid: {
        left: '3.5%',
        right: '1%',
        width: '60%',
        height:'60%',
        top:'25%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['自营渠道', '社会渠道', '带店加盟'],
          axisLabel: { 
              textStyle: {
                  color: textColor,
                  fontSize: 0.7*fontsize,
              }
          },
          axisTick: {
              inside:true,
              length:8,
              lineStyle: {
                  color: textColor,
              }
          },
          axisLine: {
              lineStyle: {
                  color: textColor,
              }
          },         
        }
      ],
      yAxis: [
        {
          type: 'value',    
          axisLabel: {
              //padding: [0, 8, 0, 0],
              textStyle: {
                  color: textColor,
                  fontSize: 0.7*fontsize,
              }
          },
          axisTick: {
              lineStyle: {
                  color: textColor,
              }
          },
          axisLine: {
              lineStyle: {
                  color: textColor,
              }
          },    
          name: '数目 (个)',
          nameTextStyle: {
              color: textColor,
              fontSize: 0.8*fontsize,
          },
          nameGap:25,
           splitLine: {  
              show:false,
          },
        },
        {
          type: 'value',
          gridIndex: 0,
          splitLine: {
              show: false
          },
          axisLine: {
              show: false
          },
          axisTick: {
              show: false
          },
          axisLabel: {
              show: false
          },
        }
      ],
      series: [
        {
          type: 'bar',
          barWidth: '28%',
          label: {
            normal: {
              show: true,
              position: "top",
              distance:5,
              formatter: function(params) {
                return params.data.value;
              },
              textStyle: {
                color: textColor,
                fontSize: 0.8 * fontsize
              }
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: barColor[0]
              },
              {
                  offset: 0.5,
                  color: barColor[1]
              },
              {
                  offset: 1,
                  color: barColor[2]
              }]
              )
            }
          },
          data: bardata
        },
        {
          name: '背景',
          type: 'bar',
          barWidth: '47%',
          xAxisIndex: 0,
          yAxisIndex: 1,
          barGap: '-135%',
          data: [20, 20, 20],
          itemStyle: {
              normal: {
                  color: 'rgba(255,255,255,0.1)'
              }
          },
          zlevel: 9
        },
        {
          name: '竞争分析',
          type: 'pie',
          center: ['80%', '48%'],
          radius: '39%',
          data: pieData,
          color:piecolor ,
          label:pielabel,     //echarts3
          itemStyle:{normal:{label:pielabel}}  //echarts2
        }
      ]
    });
  }

  /*==========================商业报告-交通便利方法===========================*/
  barOfTraf(data){
    let busSta = data.data.data.candidate.busSta;
    let stopPot = data.data.data.candidate.stopPot;
    let subway = data.data.data.candidate.subway;
    let flyover = data.data.data.candidate.flyover;
    let crossing = data.data.data.candidate.crossing;
    let xData = ['公交站', '停车场', '路口','地铁站', '高架桥'];
    let yData = [busSta,stopPot,crossing, subway, flyover];

    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('barOfTraf'));
    let textColor = 'rgba(222,226,209,1)';
    let fontsize = 16;
    let barColor = ['#00feff', '#027eff', '#0286ff'];
    myChart.setOption({
      animation: false,  //一定要设置为false，不然xdoc收到的图片是空的
      title: {
        text:'交通便利',
        textStyle: {
          color: '#f5f4e8',
          fontSize: 18,
        }
      }, 
      color: ' #3398DB',
      grid: {
        left: '2%',
        top: '25%',
        height: '70%',
        width: '85%',
        containLabel: true,
      },
      xAxis:[
        {
          type: 'category',
          gridIndex: 0,
          data: xData,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
                color: textColor
            }
          },
          axisLabel: {
            margin: 10,
            show: true,
            color: textColor,
            fontSize: 0.8*fontsize
          }
        }
      ],
      yAxis:[
        {
          name: '数目 (个)',
          nameTextStyle: {
            color: textColor,
            fontSize: 0.8*fontsize,
          },
          nameGap: 25,
          type: 'value',
          gridIndex: 0,
          splitLine: {
              show: false
          },
          axisTick: {
              alignWithLabel: true
          },
          axisLine: {
              lineStyle: {
                  color: textColor
              }
          },
          axisLabel: {
            margin: 13,
            color: textColor,
            formatter: '{value}',
            fontSize: 0.8*fontsize,
          },
        },
        {
          type: 'value',
          gridIndex: 0,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
        }
      ],
      series:[
        {
          type: 'bar',
          barWidth: '32%',
          xAxisIndex: 0,
          yAxisIndex: 0,
          label: {
            normal: {
              show: true,
              position: "top",
              textStyle: {
                  color: textColor,
                  fontSize: 0.8 * fontsize
              }
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: barColor[0]
              },
              {
                offset: 0.5,
                color: barColor[1]
              },
              {
                offset: 1,
                color: barColor[2]
              }])
            }
          },
          data: yData,
          zlevel: 11
        },
        {
          name: '背景',
          type: 'bar',
          barWidth: '51%',
          xAxisIndex: 0,
          yAxisIndex: 1,
          barGap: '-135%',
          data: [100, 100, 100, 100, 100],
          itemStyle: {
            normal: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          zlevel: 9
        },
      ]
    });
  }

  /*==========================商业报告-客户价值方法===========================*/
  pieOfCusval(data){
    let arpu = data.data.data.candidate.arpu;
    let dou = data.data.data.candidate.dou;
    let mou = data.data.data.candidate.mou;
    let ngMou = data.data.data.candidate.ngMou;

    let liAppC = data.data.data.candidate.liAppC;
    let baAppC = data.data.data.candidate.baAppC;

    let femaleC = data.data.data.candidate.femaleC;
    let maleC = data.data.data.candidate.maleC;
    let highC = data.data.data.candidate.highC;
    let nHighC = data.data.data.candidate.nHighC;
    let ngHighC = data.data.data.candidate.ngHighC;
    let ngNHighC = data.data.data.candidate.ngNHighC;
    
    let malepieData = [
      {name: '工作地\n女性用户', value: Math.round(femaleC*100).toFixed(2)},
      {name: '工作地\n男性用户', value: Math.round(maleC*100).toFixed(2)}  
    ];
    let workhighpieData = [
      {name: '工作地\n中高端用户', value: Math.round(highC*100).toFixed(2)},
      {name: '工作地\n非中高端用户', value: Math.round(nHighC*100).toFixed(2)} 
    ];
    let livehighpieData = [
      {name: '居住地\n中高端用户', value: Math.round(ngHighC*100).toFixed(2)} ,
      {name: '居住地\n非中高端用户', value: Math.round(ngNHighC*100).toFixed(2)} 
    ] ;
    let xdataName=  ['（工）人口ARPU均值','（工）人口DOU均值','（工）人口MOU均值','（居）人口MOU均值','（工）人口中银行类APP平均使用数目','（工）人口中生活类APP平均使用数目'];
    let xdata = [arpu, dou, mou, ngMou, baAppC,liAppC];

    let myChart = echarts.init(document.getElementById('pieOfCusval'));
    let textColor = 'rgba(222,226,209,1)'; 
    let fontsize = 14;
    let barColor = ['#00feff', '#027eff', '#0286ff'];
    let piecolor = ['#248888','#09194F','#6abe83','#00a03e','#037365',' #1B6AA5' ];
    let pieRadius = '30%';
    let pieBorderColor = '#33363b';
    let pielabel = {
      color:textColor,
      fontSize:0.8*fontsize, 
      formatter:'{b}\n\n{c}%' ,
      position: 'inner',
      textStyle: {fontSize:0.8*fontsize}  //echarts2
    }   
    myChart.setOption({
      animation: false,  //一定要设置为false，不然xdoc收到的图片是空的
      title: {
        text:'客户价值',
        textStyle: {
          color: '#f5f4e8',
          fontSize: 18,
        }
      }, 
      grid: {
        left: '5%',
        width: '58%',
        height:'90%',
        top:'13%',
        containLabel: true,
      },
      xAxis: [  
        {
          type : 'category',
           axisLine: {
              lineStyle: {
                  type: 'solid',
                  color: textColor,
                  width:'1' 
              }
          },
          axisLabel:  {
              interval: 0,
              rotate:45,
              show: true,
              splitNumber: 15,
              textStyle: {
                  color:textColor,
                  fontSize: 0.7*fontsize,
              },
          },
          axisTick: {
              alignWithLabel: true
          },       
          data : xdataName,
        }
      ],
      yAxis: [ 
        {
          type : 'value',
          nameTextStyle:{
            fontSize:fontsize
          },
          splitLine: {  
            show: false,     
          },
          axisLabel: {
            interval: 0,
            rotate: 0,
            show: true,
            splitNumber: 30,
            textStyle: {
              color:textColor,
              fontSize: 0.8*fontsize,
            }
          },
          axisLine: {
            lineStyle: {
              color: textColor,
            }
          },
        },
      ],
      series: [
        {
          name:'',
          type:'bar',
          barWidth : '50%',
          data:xdata,
          itemStyle: {
            normal: {
              color:  new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: barColor[0]
              },
              {
                offset: 0.5,
                color: barColor[1]
              },
              {
                offset: 1,
                color: barColor[2]
              }]),
              label: {
                show: true,
                position: 'top',
                formatter: '{c}',
                textStyle: {
                  color: textColor,
                  fontSize:  0.8*fontsize
                }
              }
            }
          }
        },          
        {
          name: '工作地性别比',
          type: 'pie',
          center: ['82%', '18%'],
          radius: pieRadius,
          data: malepieData,
          color:[piecolor[0],piecolor[1]],
          label:pielabel,   //echarts3
          itemStyle:{normal:{label:pielabel}}   //echarts2
        },
        {
          name: '工作地中高端用户比',
          type: 'pie',
          center: ['82%', '50%'],
          radius: pieRadius,
          data:workhighpieData,
          color:[piecolor[2],piecolor[3]],
          label:pielabel,   //echarts3
          itemStyle:{normal:{label:pielabel}}  //echarts2
        },
        {
          name: '居住地中高端用户比',
          type: 'pie',
          center: ['82%', '82%'],
          radius: pieRadius,
          data: livehighpieData,
          color:[piecolor[4],piecolor[5]],
          label:pielabel,    //echarts3
          itemStyle:{normal:{label:pielabel}}    //echarts2
        }
      ]
    });
  }

  /*==============================地图公用方法==============================*/

  /**
   * 缩放至指定中心点
   * @param {Context} context
   * @param params
   * @private
   */
  zoomToCenter = (map, centerCoor, scale) => {
    map.setView(centerCoor, scale);
  }

  /**
   * 根据id更新图层
   * @param {Context} context
   * @param params
   * @private
   */
  updateFilterById = (idList, layer) => {
    let filter = "grid_id in (" + idList + ")";
    layer.setParams({
      CQL_FILTER: filter
    })
  }

  /**
   * 根据城市更新图层
   * @param {Context} context
   * @param params
   * @private
   */
  updateFilterByCity = (layer, city) => {
    let filter = "city = " + '\'' + city + '\'';
    layer.setParams({
      CQL_FILTER: filter
    })
  }

  /*==============================公共方法==============================*/
  /**
   * 切换页面事件
   * @param {Context} context
   * @param params
   * @private
   */
  changeTab(params) {
    // 切换当前底部高亮图标
    this.initialData.currentFootBarIndex = this.footBar[params.topView];
    // 更新当前城市
    this.initialData.currentCity = this.currentCity;
    params.params = { ...params.params,
      ...this.initialData
    };
    this.processCommand(CommandType.TRANSFER_VIEW, {params});
  }

  /**
   * 弹出全局提示框，进行业务退出操作
   * @param {Context} context
   * @param {string} text 
   */
  toast(params) {
    this.controller.processCommand(CommandType.TOAST, params);
  }

  /**
   * 弹出全局提示框，提示是否退出业务
   * @param {Context} context
   * @param {string} text 
   */
  notify(params) {
    this.controller.processCommand(CommandType.NOTIFY, params);
  }

  /**
   * 展示要素表
   * @param {Context} context
   * @param {boolean} bool 
   */
  showFeatureTable(bool) {
    this.initialData.featureTableVisiable = bool;
    this.changeTab({ topView: 'init', params: this.initialData })
  }

  /**
   * 展示loading组件
   * @param {Context} context
   * @param {boolean} bool 
   */
  showLoading(bool) {
    this.initialData.isLoading = bool;
  }
}

export default Context;