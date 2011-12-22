
namespace :images do
    imgTasks = []
    imgs = FileList['src/base/images/**/*.png', 'src/base/images/**/*.jpg']

    imgOutputDir = "out/public/images"
    imgs.each do |f|
        destFile = imgOutputDir + "/" + f.sub("src/base/images/", "")
        file destFile => [f] do
            mkdir_p File.dirname(destFile)
            FileUtils.cp f, destFile
        end
        imgTasks.push(destFile)
    end

    task :imgs => imgTasks
    task :do => [:imgs]
end


