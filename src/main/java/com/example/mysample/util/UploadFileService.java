package com.example.mysample.util;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadFileService {

	public String upload(MultipartFile file) {
		
		String root = "C:\\goods\\upload";
		File fileCheck = new File(root);
		if(!fileCheck.exists()) fileCheck.mkdirs();
		
		String originFile = file.getOriginalFilename();
		String ext = originFile.substring(originFile.lastIndexOf("."));
		String uuid = UUID.randomUUID().toString() + ext;
		String changeFile = uuid.toString().replaceAll("-", "");
		
		try {
			File uploadFile = new File(root + "\\" + changeFile);
			file.transferTo(uploadFile);
		} catch (IllegalStateException | IOException e) {
			new File(root + "\\" + changeFile).delete();
			e.printStackTrace();
		}
		
		return changeFile;
	}
	
}
