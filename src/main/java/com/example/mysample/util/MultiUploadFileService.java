package com.example.mysample.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MultiUploadFileService {
	public List<String> multiUpload(List<MultipartFile> files) {
		String root = "C:\\goods\\upload";
		File fileCheck = new File(root);
		if(!fileCheck.exists()) fileCheck.mkdirs();
		
		List<String> originFileList = new ArrayList<>();
		List<String> changeFileList = new ArrayList<>();
		
		for(int i = 0; i < files.size(); i++) {
			String originFile = files.get(i).getOriginalFilename();
			String ext = originFile.substring(originFile.lastIndexOf("."));
			String uuid = UUID.randomUUID().toString() + ext;
			String changeFile = uuid.toString().replaceAll("-", "");
			
			originFileList.add(originFile);
			changeFileList.add(changeFile);
		}
		
		try {
			for(int i = 0; i < files.size(); i++) {
				File uploadFile = new File(root + "\\" + changeFileList.get(i));
				files.get(i).transferTo(uploadFile);
			}
			
		} catch (IllegalStateException | IOException e) {
			for(int i = 0; i < files.size(); i++) {
				new File(root + "\\" + changeFileList.get(i)).delete();
			}
			e.printStackTrace();
		}
		
		return changeFileList;
	}
}
