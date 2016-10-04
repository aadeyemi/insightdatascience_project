//
//  ViewController.swift
//  litali
//
//  Created by Yemi Arogunmati on 9/18/16.
//  Copyright © 2016 Zyn LLC. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, ApiGetTopicProtocol {
    
    var mCell: MainTableViewCell!
    var mApiGetTopic: ApiGetTopic!
    @IBOutlet weak var mTableView: UITableView!

    @IBAction func getTopicAction(sender: AnyObject) {
        var text = mCell.mTextView.text
        text = text.replaceMultiSpaceAndNewLineWithSpace
        print(text)
        text = text.base64Encoded
        print(text)
        mCell.mLabelView.text = "Working..."
        mApiGetTopic.getTopic(text)
    }
    
    @IBAction func clearTopicAction(sender: AnyObject) {
        mCell.mLabelView.text = "Ready"
        
    }
    
    @IBAction func clearAllAction(sender: AnyObject) {
        mCell.mTextView.text = ""
        mCell.mLabelView.text = "Ready"
    }
    
    override func viewDidLoad() {
        mApiGetTopic = ApiGetTopic(delegate: self)
        mTableView.separatorStyle = UITableViewCellSeparatorStyle.None
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell: MainTableViewCell = tableView.dequeueReusableCellWithIdentifier("main_cell", forIndexPath: indexPath) as! MainTableViewCell
        
        cell.mTextView.text = "I received a garnishment exemption claim form from a creditor. Does this mean the garnishment has started OR does it mean we go to court first. Should I contact and try and work out payment plan. I can't afford a lot but my company is funny and everybody know everybody's business. I have a lot of responsibility and want this settled privately."
        
        cell.mLabelView.text = "Ready"
        
        cell.selectionStyle = UITableViewCellSelectionStyle.None
        
        mCell = cell
            
        return cell
        
    }
    
    
    func didReceiveTopic(message: String) {
        print(message)
        dispatch_async(dispatch_get_main_queue(), {
            self.mCell.mLabelView.text = message
        })
        
    }
    
    func didReceiveTopicError(message: String) {
        print(message)
        
    }
    
    func didReceiveZeroTopic(message: String) {
        print(message)
        
    }

}

