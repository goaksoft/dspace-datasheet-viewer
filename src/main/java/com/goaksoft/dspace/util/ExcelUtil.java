package com.goaksoft.dspace.util;

import com.alibaba.fastjson.JSONArray;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;

/**
 * @author  coke
 * @version V1.0
 * @desc    Excel操作工具类
 */
public class ExcelUtil {
    public static final String OFFICE_EXCEL_XLS = "xls";    // Excel 格式
    public static final String OFFICE_EXCEL_XLSX = "xlsx";  // Excel 格式
    public static List<String> sheetName = null;            // Excel sheet 名称

     /**
     * 根据字节流获取Workbook对象
     * @param is 文件流
     * @return HSSFWorkbook 对象
     * @throws IOException 文件异常
     */
    public static HSSFWorkbook getWorkbook(InputStream is) throws IOException{
        HSSFWorkbook wb = new HSSFWorkbook(is);
        
        // 判断关闭文件流
        if (is != null) {
            is.close();
        }
        
        // 判断关闭Workbook对象
        if (wb != null) {
            wb.close();
        }
        return wb;
    }
    
    /**
     * 读取指定Sheet
     * @param filepath 文件路径
     * @param sheetNo sheet序号
     * @return HSSFSheet表
     * @throws IOException 文件异常
     */
    public static HSSFSheet getSheet(InputStream is, Integer sheetNo) throws IOException{
        // 打开指定位置的Excel文件
        HSSFWorkbook workbook = getWorkbook(is);
        if (workbook != null) {
            sheetName = new ArrayList<String>();
            // 打开Excel中的第sheetNo个Sheet
            HSSFSheet sheet = workbook.getSheetAt(sheetNo);
                
            if(sheet.getLastRowNum() == 0 && sheet.getFirstRowNum() == 0){
                return null;
            }
            
            int numberOfSheets = workbook.getNumberOfSheets();
            if(numberOfSheets > 1){
                for (int i = 0; i < numberOfSheets; i++) {
                    // 打开Excel中的Sheet
                    HSSFSheet sn = workbook.getSheetAt(i);
                    
                    if(sn.getLastRowNum() != 0 || sn.getFirstRowNum() != 0){
                        sheetName.add(sn.getSheetName());
                    }
                }
            }
            return sheet;
        }
        return null;
    }
    
    /**
     * 判断行为空
     * @param hssfRow
     * @return 
     */
    private static int CheckRowNull(HSSFRow hssfRow){
        int num = 0;
        Iterator<Cell> cellItr = hssfRow.iterator();
        // 循环判断
        while(cellItr.hasNext()){
            Cell c = cellItr.next();                        
            if(c.getCellType() == HSSFCell.CELL_TYPE_BLANK || "".equals(c.toString().trim())){
                num++;
            }
        }
        return num;
    }

    
    /**
     * 读取excel 封装成集合
     * @param is 文件流
     * @return  集合
     * @throws IOException 文件异常
     */
    public static List<List<String>> readExcel(InputStream is, Integer sheetNo) throws IOException{
        List<List<String>> list = new ArrayList<List<String>>();

        // 读取 Sheet
        HSSFSheet sheet = getSheet(is, sheetNo);
        
        // 判断Sheet是否为空
        if(sheet == null){
            return list;
        }
        
        // 获取sheet1中的总行数
        int rowTotalCount = sheet.getLastRowNum();
        // 获取总列数
        int columnCount = sheet.getRow(0).getPhysicalNumberOfCells();

        for (int i = 0; i <= rowTotalCount; i++) {
            // 获取第i列的row对象
            HSSFRow row = sheet.getRow(i);
            
            // 判断行为空
            int num = CheckRowNull(row);
            
            // 判断空单元格是否等于当前所有单元格
            if(num != columnCount){
                List<String> listRow = new ArrayList<String>();
                for (int j = 0; j < columnCount; j++) {
                    String cell = null;
                    
                    // 如果 为 null 则加上 "暂无数据" 添加到集合中
                    if(row.getCell(j) == null){ 
                        cell = "暂无数据";
                        listRow.add(cell);
                    }else{                     
                        // 读取单元格并转换为String类型
                        cell = row.getCell(j).toString();
                        
                        // 再次判断 单元格数据是否为空
                        if("".equals(cell.trim()) && cell.isEmpty()){
                            cell = "暂无数据";
                        }
                        listRow.add(cell);
                    }
                }
                list.add(listRow);
            }
        }
        return list;
    }
   
    
    /**
     * 返回 explore 页面所需要的值
     * @param result 集合
     * @return
     */
    public static ExploreEntryUtil getExplore(List<List<String>> result){
        int count = 0;  // 下标
        int lng = 0;    // 经度
        int lat = 0;    // 纬度

        JSONArray data = new JSONArray();       // datatable 内容
        JSONArray columns = new JSONArray();    // datatable 标题
        JSONArray maps = new JSONArray();       // maps地图  内容
        JSONArray echartsSel = new JSONArray(); // echarts   下拉框
        JSONArray echartsData = new JSONArray();// echarts   内容
        JSONArray echartsOne = new JSONArray(); // echarts   xAxis值
        
        Integer[] re = new Integer[result.get(1).size()];
        List<String> titlelist = new ArrayList<String>();

        ExploreEntryUtil vo = new ExploreEntryUtil();

        for(String item : result.get(0)){
            // 获取标题(datatables)
            Map<String,Object> datatables = new HashMap<String,Object>();
            datatables.put("title", item.trim());
            columns.add(datatables);

            // 添加标题到 list中，为下面的遍历做准备
            titlelist.add(item);

            // 判断经纬度获取下标
            if("经度".equals(item.trim()) || "lng".equals(item.trim())){
                lng = count;    // 经度下标
            }else if("纬度".equals(item.trim()) || "lat".equals(item.trim())){
                lat = count;    // 纬度下标
            }
            count++;
        }

        // 获取值打印到 datatables中
        for(int i = 1; i < result.size(); i++){
            data.add(result.get(i));
        }

        if(lng != 0 && lat != 0){
            // 判断获取 文件中的文件是否是数字类型的值，如果是存下标
            for(int i = 0; i< result.get(1).size(); i++){
                if(isDouble(result.get(1).get(i))){     // 判断值类型
                    re[i] = i;
                }
            }

            // 根据上面存入的下标去 list 中取值，并存入到 JSONArray中
            for(Integer item : re){
                if(item != null){
                    echartsSel.add(titlelist.get(item));
                }
            }
        }

        // 删除 经纬度 的标题
        // titlelist.remove(lng);
        // titlelist.remove(lat-lng);

        // 删除第一行（标题）
        result.remove(0);

        for(List<String> items : result){
            // 进行地图格式存储
            Map<Object, Object> map = new HashMap<Object, Object>();

            if(lng != 0 && lat != 0){
                if( !"".equals(items.get(lng).trim()) &&  !"暂无数据".equals(items.get(lng).trim())
                        && !"".equals(items.get(lat).trim()) && !"暂无数据".equals(items.get(lat).trim())){
                    map.put("lng", items.get(lng).trim());
                    map.put("lat", items.get(lat).trim());
                    map.put("id", count++);
                    map.put("name", items.get(0).trim());
                    maps.add(map);
                }
            }

            // 获取第一列，作为echarts中 横 ( x ) 坐标
            echartsOne.add(items.get(0));

            // 删除 经纬度 的值
            // items.remove(lng);
            // items.remove(lat-lng);

            List<String> datalist = new ArrayList<String>();

            // 图表内容
            for(String item : items){
                if(!"".equals(item.trim())){   // 判断内容是否为空
                    if(isDouble(item.trim())){ // 判断内容类型是否是数字
                        datalist.add(item.trim());
                    }
                }
            }

            // Echarts 数据
            if(datalist.size() > 0){
                echartsData.add(datalist);
            }
        }

        vo.setColumns(columns);
        vo.setData(data);
        vo.setMaps(maps);
        vo.setEcharts(echartsData);
        vo.setEchartsSel(echartsSel);
        vo.setEchartsOne(echartsOne);

        return vo;
    }

    
    /**
     * 获取后缀
     * @param filepath filepath 文件全路径
     */
    public static String getSuffiex(String filepath) {
        if (StringUtils.isBlank(filepath)) {
            return "";
        }
        int index = filepath.lastIndexOf(".");
        if (index == -1) {
            return "";
        }
        return filepath.substring(index + 1, filepath.length());
    }
    
    /**
     * 判断浮点数（double和float）
     * @param str 需要判断的 String 数值
     * @return true/false
     */
    public static boolean isDouble(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch(NumberFormatException ex){}
        return false;
    }

}

