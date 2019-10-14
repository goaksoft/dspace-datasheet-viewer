package com.goaksoft.dspace.servlet;

import com.goaksoft.dspace.util.ExploreEntryUtil;
import java.io.IOException;
import java.io.InputStream;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author  coke
 * @version V1.0
 * @desc    servlet
 */
@WebServlet(urlPatterns = { "/explore" })
public class ExploreServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Integer sheetNo = Integer.parseInt(request.getParameter("sheetNo"));
        // 文件路径
        String file = "/explore.xls";

        // 字节流
        InputStream is = this.getClass().getResourceAsStream(file);

        ExploreEntryUtil.setExplore(is, file, sheetNo, request);
        
        request.getRequestDispatcher("explore.jsp").forward(request,response);
    }
}

