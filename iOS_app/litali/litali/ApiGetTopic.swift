//
//  ApiGetTopic.swift
//  litali
//
//  Created by Yemi Arogunmati on 9/18/16.
//  Copyright © 2016 Zyn LLC. All rights reserved.
//

import Foundation

protocol ApiGetTopicProtocol {
    func didReceiveTopic(results: String)
    func didReceiveTopicError(results: String)
    func didReceiveZeroTopic(message: String)
}

class ApiGetTopic {
    
    var delegate: ApiGetTopicProtocol
    
    init(delegate: ApiGetTopicProtocol) {
        self.delegate = delegate
    }
    
    func hostUrl() -> String {
        return "http://54metrics.com/insightdatascience/predictor/"
    }
    
    func getTopic(text: String) {
        let errorMsg1 = "unable to connect"
        let errorMsg2 = "invalid data received"
        
        let urlPath = hostUrl() + "call_predictor.php?text=" + text
        
        let url = NSURL(string: urlPath)
        let session = NSURLSession.sharedSession()
        let task = session.dataTaskWithURL(url!, completionHandler: {data, response, error -> Void in
            if(error != nil) {
                self.delegate.didReceiveTopicError(errorMsg1)
                print(error!.localizedDescription + errorMsg1)
            } else {
                do {
                    let jsonResult = try NSJSONSerialization.JSONObjectWithData(data!, options: .AllowFragments) as! NSDictionary
                    print(jsonResult)
                    
                    if let status = jsonResult["status"] as? String {
                        if (status == "0") { // user details found
                            if let message = jsonResult["message"] as? String {
                                self.delegate.didReceiveTopic(message)
                            } else {
                                self.delegate.didReceiveTopicError(errorMsg2) // bad data
                            }
                        }
                        else if (status == "2") { // zero users found
                            self.delegate.didReceiveZeroTopic("Your account was not found")
                        }
                        else { // server error, alert user
                            if let message = jsonResult["message"] as? String {
                                self.delegate.didReceiveTopicError(message)
                            } else {
                                self.delegate.didReceiveTopicError(errorMsg2) // bad data
                            }
                        }
                    }
                } catch let error as NSError {
                    self.delegate.didReceiveTopicError(errorMsg2) // bad data
                    print("A JSON parsing error occurred, here are the details:\n \(error)")
                }
            }
        })
        task.resume()
    }
    
    
}

